INSERT INTO activity (fk_user, fk_proj, activity)
VALUES ($1, $2, $3)
RETURNING *;
