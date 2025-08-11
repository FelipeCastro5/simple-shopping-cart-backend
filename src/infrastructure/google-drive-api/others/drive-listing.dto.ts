export interface DriveFileDto {
  id: string;
  name: string;
  mimeType: string;
  url: string | null;
}

export interface DriveSubfolderDto {
  id: string;
  name: string;
  files: DriveFileDto[];
}

export interface DriveListingDto {
  parentFolderId: string;
  subfolders: DriveSubfolderDto[];
}
