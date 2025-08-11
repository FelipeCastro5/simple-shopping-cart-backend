UPDATE "user"
SET user_name = $1,
    email = $2
WHERE id_user = $3 RETURNING *;