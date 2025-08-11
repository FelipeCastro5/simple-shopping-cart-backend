UPDATE activity
SET fk_user = $1, fk_proj = $2, activity = $3
WHERE id_act = $4
RETURNING *;
