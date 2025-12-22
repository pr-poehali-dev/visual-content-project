-- Скрываем видео "селфи" из галереи
UPDATE videos SET is_visible = false WHERE id IN (1, 2);