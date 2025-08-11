INSERT INTO historial (fk_user, question, answer)
VALUES ($1, $2, $3)
RETURNING *;