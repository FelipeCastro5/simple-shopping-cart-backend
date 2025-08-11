import { Controller, Post, Get, Delete, Body, UploadedFile, UseInterceptors, Query, BadRequestException, Param, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ResponseUtil } from '../../application/utilities/response.util';
import { GoogleDriveService } from './google-drive.service';
@ApiTags('Google Drive')
@Controller('drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) { }

  @Get('getFileOrFolderById')
  @ApiOperation({ summary: 'Obtener información de un archivo o carpeta por ID' })
  @ApiQuery({ name: 'id', required: true, description: 'ID del archivo o carpeta en Google Drive' })
  async getFileOrFolderInfo(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('El ID es requerido.');
    }
    const info = await this.googleDriveService.getFileOrFolderInfo(id);
    return ResponseUtil.success(info, 'Información obtenida correctamente.');
  }

  @Post('upload-to-folder-id')
  @ApiOperation({ summary: 'Subir un archivo a una carpeta de Google Drive por ID de carpeta' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folderId: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['folderId', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToFolderById(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }
    if (!folderId) {
      throw new BadRequestException('El ID de la carpeta es requerido.');
    }
    const result = await this.googleDriveService.uploadFileToFolderById(file, folderId);
    return ResponseUtil.success(result, 'Archivo subido correctamente a la carpeta indicada.');
  }

  @Get('list')
  @ApiOperation({ summary: 'Listar archivos y carpetas dentro de una carpeta (opcional)' })
  @ApiQuery({ name: 'parentFolderId', required: false })
  async listFilesAndFolders(@Query('parentFolderId') parentFolderId?: string) {
    const items = await this.googleDriveService.listFilesAndFolders(parentFolderId);
    return ResponseUtil.success(items, 'Elementos obtenidos correctamente.');
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Eliminar archivo por URL de Google Drive' })
  @ApiQuery({ name: 'fileUrl', required: true, description: 'URL del archivo a eliminar' })
  async deleteFile(@Query('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('La URL del archivo es requerida.');
    }
    await this.googleDriveService.deleteFileByUrl(fileUrl);
    return ResponseUtil.success(null, 'Archivo eliminado correctamente.');
  }

  @Get('root')
  @ApiOperation({ summary: 'Listar archivos y carpetas en la raíz de Google Drive' })
  async listRootFiles() {
    const items = await this.googleDriveService.listFilesAndFolders();
    return ResponseUtil.success(items, 'Contenido raíz obtenido correctamente.');
  }

  @Post('share')
  @ApiOperation({ summary: 'Compartir archivo o carpeta con un usuario por correo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileOrFolderId: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', enum: ['reader', 'writer'], default: 'writer' },
      },
      required: ['fileOrFolderId', 'email'],
    },
  })
  async shareFile(
    @Body('fileOrFolderId') fileOrFolderId: string,
    @Body('email') email: string,
    @Body('role') role: 'reader' | 'writer' = 'writer',
  ) {
    if (!fileOrFolderId || !email) {
      throw new BadRequestException('fileOrFolderId y email son requeridos.');
    }
    await this.googleDriveService.shareWithUser(fileOrFolderId, email, role);
    return ResponseUtil.success(null, `Archivo o carpeta compartido con ${email} como ${role}.`);
  }

  @Get('list-subfolders-files/:parentFolderId')
  @ApiOperation({ summary: 'Listar subcarpetas y sus archivos dentro de una carpeta' })
  async listSubfoldersFiles(@Param('parentFolderId') parentFolderId: string): Promise<any> {
    const data = await this.googleDriveService.listSubfoldersAndFiles(parentFolderId);
    return ResponseUtil.success(data, 'Subcarpetas y archivos obtenidos correctamente.');
  }

  @Post('create-folder')
  @ApiOperation({ summary: 'Crear una carpeta en Google Drive' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folderName: { type: 'string' },
        parentFolderId: { type: 'string', nullable: true },
      },
      required: ['folderName'],
    },
  })
  async createFolder(
    @Body('folderName') folderName: string,
    @Body('parentFolderId') parentFolderId?: string,
  ) {
    if (!folderName) {
      throw new BadRequestException('El nombre de la carpeta es requerido.');
    }
    const folderId = await this.googleDriveService.createFolder(folderName, parentFolderId);
    return ResponseUtil.success({ folderId }, 'Carpeta creada correctamente.');
  }

}
