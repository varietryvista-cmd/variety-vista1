-- Fix the stock decrement trigger to raise an exception on insufficient stock

CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
  current_stock INT;
  variant_name TEXT;
BEGIN
  IF NEW.variant_id IS NOT NULL THEN
    -- Lock the row and get current stock
    SELECT stock_quantity INTO current_stock
    FROM product_variants
    WHERE id = NEW.variant_id FOR UPDATE;
    
    IF current_stock IS NULL THEN
      RAISE EXCEPTION 'Variant % does not exist.', NEW.variant_id;
    END IF;

    IF current_stock < NEW.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for variant %. Requested %, but only % available.', NEW.variant_id, NEW.quantity, current_stock;
    END IF;

    UPDATE product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.variant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
