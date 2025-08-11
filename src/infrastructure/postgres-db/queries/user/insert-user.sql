INSERT INTO "user" (user_name, email)
VALUES ($1, $2) RETURNING *;