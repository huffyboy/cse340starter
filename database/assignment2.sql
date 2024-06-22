
INSERT INTO account
	(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- This will only work on the first run as tony will be the first entry
-- I'm only doing it this way per assignment instructions.
UPDATE account
SET account_type = 'Admin'::public.account_type
WHERE account_id = 1;

-- This will only work on the first run as tony will be the first entry
-- I'm only doing it this way per assignment instructions.
DELETE FROM account
WHERE account_id = 1;


UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;


SELECT
	i.inv_make,
	i.inv_model
FROM inventory i
JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');



