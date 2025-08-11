UPDATE project
SET proj_name = $1,
    details = $2
WHERE id_proj = $3 RETURNING *;
