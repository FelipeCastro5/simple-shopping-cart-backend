export class SqlSanitizer {
  // Lista básica de patrones peligrosos
  private static readonly blackListPatterns: RegExp[] = [
    /(\b(ALTER|DROP|TRUNCATE|GRANT|REVOKE|EXEC|EXECUTE|MERGE|UNION|INSERT|UPDATE|DELETE|CREATE|REPLACE)\b)/gi,
    /(--|#)/g,                         // Comentarios SQL
    /(\bOR\b\s+\d+=\d+)/gi,            // OR 1=1
    /(;)/g,                            // Punto y coma para múltiples sentencias
    /(['"]).*?\1.*?\1/g,               // Comillas anidadas
    /(\bSELECT\b.*\bFROM\b)/gi,        // SELECT abusivo
    /(\bWHERE\b\s+\d+=\d+)/gi          // WHERE 1=1
  ];

  /**
   * Retorna el patrón que coincide si se detecta contenido peligroso
   * @param input Texto a analizar
   * @returns null si es seguro, o el patrón que coincide si no lo es
   */
  public static findDangerousPattern(input: string): string | null {
    if (!input || typeof input !== 'string') return null;

    for (const pattern of this.blackListPatterns) {
      if (pattern.test(input)) {
        return pattern.toString();
      }
    }

    return null;
  }

  /**
   * Valida un campo y retorna información si es malicioso
   * @param input Texto a analizar
   * @param fieldName Nombre del campo (para reporte)
   * @returns null si es seguro, o un objeto con información si no
   */
  public static validate(input: string, fieldName: string = 'input'): { field: string; pattern: string } | null {
    const match = this.findDangerousPattern(input);
    if (match) {
      return { field: fieldName, pattern: match };
    }
    return null;
  }
}
