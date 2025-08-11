import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { join } from 'path';
import { Readable } from 'stream';
import { existsSync, readFileSync } from 'fs';
import { Express } from 'express';
import { DriveFileDto, DriveListingDto, DriveSubfolderDto } from './others/drive-listing.dto';

@Injectable()
export class GoogleDriveService {
  private driveClient: ReturnType<typeof google.drive>;

  constructor() {
    const credentials = process.env.GOOGLE_DRIVE_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS)
      : this.loadCredentialsFromFile();

    const authClient = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.driveClient = google.drive({ version: 'v3', auth: authClient });
  }

  private loadCredentialsFromFile() {
    const filePath = join(process.cwd(), 'google-drive-credentials.json');
    if (!existsSync(filePath)) throw new Error('Google Drive credentials not found.');
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false` +
        (parentFolderId ? ` and '${parentFolderId}' in parents` : '');

      const response = await this.driveClient.files.list({
        q: query,
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        console.log(`La carpeta '${folderName}' ya existe.`);
        return response.data.files[0].id!;
      }

      const folderMetadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentFolderId) {
        folderMetadata.parents = [parentFolderId];
      }

      const folder = await this.driveClient.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      console.log(`Carpeta creada con ID: ${folder.data.id}`);
      return folder.data.id!;
    } catch (error) {
      console.error('Error creando la carpeta:', error);
      throw new Error('No se pudo crear la carpeta en Google Drive');
    }
  }

  async getFileOrFolderInfo(fileOrFolderId: string) {
    try {
      const response = await this.driveClient.files.get({
        fileId: fileOrFolderId,
        fields: 'id, name, mimeType, webViewLink',
      });

      const file = response.data;

      if (!file) {
        throw new Error('No se encontró el archivo o carpeta.');
      }

      return {
        id: file.id,
        name: file.name,
        type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
        url: file.webViewLink || null,
      };
    } catch (error) {
      console.error('Error obteniendo información:', error);
      throw new Error('No se pudo obtener la información del archivo o carpeta');
    }
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      const fileId = this.extractId(fileUrl);
      if (!fileId) {
        throw new Error('No se pudo extraer el ID del archivo de la URL proporcionada.');
      }

      await this.driveClient.files.delete({ fileId });
      console.log(`Archivo con ID ${fileId} eliminado exitosamente.`);
    } catch (error) {
      console.error('Error eliminando el archivo:', error);
      throw new Error('No se pudo eliminar el archivo de Google Drive');
    }
  }

  async uploadFileToFolderById(file: Express.Multer.File, folderId: string) {
    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      };

      const response = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, webViewLink',
      });

      const fileId = response.data.id;
      if (!fileId) {
        throw new Error('El archivo no tiene un ID válido después de crearse.');
      }

      await this.driveClient.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      console.log('Archivo subido y compartido:', response.data);
      return {
        fileId,
        fileUrl: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Error subiendo el archivo:', error);
      throw new Error('No se pudo subir el archivo a Google Drive');
    }
  }

  async listFilesAndFolders(parentFolderId?: string) {
    try {
      const query = parentFolderId
        ? `'${parentFolderId}' in parents and trashed=false`
        : `'root' in parents and trashed=false`;

      const response = await this.driveClient.files.list({
        q: query,
        fields: 'files(id, name, mimeType)',
      });

      if (!response.data.files || !response.data.files.length) {
        console.log('No se encontraron archivos ni carpetas.');
        return [];
      }

      return response.data.files.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
      }));
    } catch (error) {
      console.error('Error obteniendo la lista de archivos y carpetas:', error);
      throw new Error('No se pudo obtener la lista de archivos y carpetas');
    }
  }

  async shareWithUser(fileOrFolderId: string, userEmail: string, role: 'reader' | 'writer' = 'writer') {
    try {
      await this.driveClient.permissions.create({
        fileId: fileOrFolderId,
        requestBody: {
          role,
          type: 'user',
          emailAddress: userEmail,
        },
      });
      console.log(`Compartido con ${userEmail}`);
    } catch (error) {
      console.error('Error compartiendo el archivo o carpeta:', error);
      throw new Error('No se pudo compartir el archivo o carpeta');
    }
  }

  async listSubfoldersAndFiles(inputIdOrUrl: string): Promise<DriveListingDto> {
    try {
      const parentFolderId = this.extractId(inputIdOrUrl);
      if (!parentFolderId) {
        throw new Error('No se pudo extraer un ID válido del input proporcionado.');
      }

      // Paso 1: Listar subcarpetas
      const subfolders = await this.driveClient.files.list({
        q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      const subfolderResults: DriveSubfolderDto[] = [];

      for (const subfolder of subfolders.data.files || []) {
        // Paso 2: Para cada subcarpeta, listar archivos
        const filesResp = await this.driveClient.files.list({
          q: `'${subfolder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
          fields: 'files(id, name, mimeType, webViewLink)',
        });

        const files: DriveFileDto[] = (filesResp.data.files || []).map((file) => ({
          id: file.id!,
          name: file.name!,
          mimeType: file.mimeType!,
          url: file.webViewLink || null,
        }));

        subfolderResults.push({
          id: subfolder.id!,
          name: subfolder.name!,
          files,
        });
      }

      return {
        parentFolderId,
        subfolders: subfolderResults,
      };
    } catch (error) {
      console.error('Error en listSubfoldersAndFiles:', error);
      throw new Error('No se pudo obtener la estructura de carpetas y archivos');
    }
  }

  private extractId(input: string): string | null {
    // Caso 1: ID directo
    if (/^[a-zA-Z0-9_-]{10,}$/.test(input)) {
      return input;
    }

    // Caso 2: URL con /file/d/FILE_ID
    let match = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Caso 3: URL con open?id=FILE_ID
    match = input.match(/open\?id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Caso 4: URL con uc?id=FILE_ID
    match = input.match(/uc\?id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Caso 5: URL con /folders/FOLDER_ID
    match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Si nada matchea
    return null;
  }

}
