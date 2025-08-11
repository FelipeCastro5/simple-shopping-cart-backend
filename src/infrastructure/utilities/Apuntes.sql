-- ELIMINAR UN SP
DROP FUNCTION IF EXISTS SP_DeletePerfil(INT);

-- Para consultar el nombre de todos los Stored Procedures (SP) 
-- en una base de datos PostgreSQL:
SELECT proname AS stored_procedure_name
FROM pg_proc
JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
WHERE pg_namespace.nspname NOT IN ('pg_catalog', 'information_schema');

-- Consultar codigo fuente de un sp
SELECT pg_get_functiondef(p.oid) 
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'getpersonalpaginated' ;

-- Eliminar varios id con loop
DO $$ 
DECLARE 
    id_actual INT := 358;
BEGIN
    WHILE id_actual <= 1000 LOOP
        PERFORM SP_DeletePerfil(id_actual);
        id_actual := id_actual + 1;
    END LOOP;
END $$;

-- eliminar la tabla sin preocuparte por restricciones
DROP TABLE salario_funcionario CASCADE;
 
SELECT
  n.nspname AS schema,
  p.proname AS function_name,
  pg_catalog.pg_get_function_arguments(p.oid) AS arguments
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND p.prokind = 'f' -- Solo funciones, no aggregates ni procedures
ORDER BY function_name;

-- consultar columnas de las tablas 
SELECT 
    column_name AS nombre_columna,
    data_type AS tipo_dato
FROM 
    information_schema.columns
WHERE 
    table_name = 'datos_personales' 
    AND table_schema = 'public'; 

-- consultar tipo date, pk, fk
SELECT 
    c.column_name AS nombre_columna,
    c.data_type AS tipo_dato,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_clave_primaria,
    CASE 
        WHEN pg_get_serial_sequence(c.table_name, c.column_name) IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_autoincrementable,
    CASE 
        WHEN fk.column_name IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_clave_foranea
FROM 
    information_schema.columns c
LEFT JOIN (
    SELECT 
        kcu.column_name
    FROM 
        information_schema.table_constraints tc
    JOIN 
        information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema
    WHERE 
        tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_name = 'datos_empresa'
        AND tc.table_schema = 'public'
) pk ON c.column_name = pk.column_name
LEFT JOIN (
    SELECT 
        kcu.column_name
    FROM 
        information_schema.table_constraints tc
    JOIN 
        information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema
    WHERE 
        tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'datos_empresa'
        AND tc.table_schema = 'public'
) fk ON c.column_name = fk.column_name
WHERE 
    c.table_name = 'datos_empresa' 
    AND c.table_schema = 'public';

--

SELECT 
    c.column_name AS nombre_columna,
    c.data_type AS tipo_dato,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_clave_primaria,
    CASE 
        WHEN pg_get_serial_sequence(c.table_name, c.column_name) IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_autoincrementable,
    CASE 
        WHEN fk.column_name IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END AS es_clave_foranea,
    fk.foreign_table AS tabla_referenciada,
    fk.foreign_column AS columna_referenciada
FROM 
    information_schema.columns c
LEFT JOIN (
    SELECT 
        kcu.column_name
    FROM 
        information_schema.table_constraints tc
    JOIN 
        information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema
    WHERE 
        tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_name = 'estado_proy'
        AND tc.table_schema = 'public'
) pk ON c.column_name = pk.column_name
LEFT JOIN (
    SELECT 
        kcu.column_name,
        ccu.table_name AS foreign_table,
        ccu.column_name AS foreign_column
    FROM 
        information_schema.table_constraints tc
    JOIN 
        information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema
    JOIN 
        information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name 
        AND tc.table_schema = ccu.table_schema
    WHERE 
        tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'estado_proy'
        AND tc.table_schema = 'public'
) fk ON c.column_name = fk.column_name
WHERE 
    c.table_name = 'estado_proy' 
    AND c.table_schema = 'public';
--

SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'datos_empresa'
    AND kcu.column_name = 'fk_cargo';

SELECT 
    column_name AS nombre_columna,
    data_type AS tipo_dato
FROM 
    information_schema.columns
WHERE 
    table_name = 'asignaciones' 
    AND table_schema = 'public'; 

