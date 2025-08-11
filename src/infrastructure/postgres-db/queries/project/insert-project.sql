INSERT INTO project (proj_name, details)
VALUES ($1, $2) RETURNING *;
