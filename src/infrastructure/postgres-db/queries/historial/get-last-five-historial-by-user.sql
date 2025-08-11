SELECT * FROM (
  SELECT * FROM historial
  WHERE fk_user = $1
  ORDER BY created_at DESC
  LIMIT 5
) AS ultimos
ORDER BY created_at ASC;
