DELETE FROM project
WHERE id_proj = $1
RETURNING *;