export function extractDriveFolderId(urlOrId: string): string {
  // Si ya es un ID válido
  if (/^[a-zA-Z0-9_-]{10,}$/.test(urlOrId)) {
    return urlOrId;
  }

  // URL tipo https://drive.google.com/drive/folders/ID
  const match = urlOrId.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // URL tipo https://drive.google.com/open?id=ID
  const altMatch = urlOrId.match(/id=([a-zA-Z0-9_-]+)/);
  if (altMatch && altMatch[1]) {
    return altMatch[1];
  }

  throw new Error("No se pudo extraer el ID de la carpeta del URL proporcionado");
}
