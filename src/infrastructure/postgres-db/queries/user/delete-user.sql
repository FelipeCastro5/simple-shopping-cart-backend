DELETE FROM "user"
WHERE id_user = $1 RETURNING *;