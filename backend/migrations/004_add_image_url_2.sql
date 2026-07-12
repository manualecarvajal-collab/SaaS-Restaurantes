-- Add image_url_2 column to menu_items for second photo support
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_url_2 TEXT;
