-- ForBids — datos de demo para presentación (Álvaro Muñoz, 2º DAW IES Camas)
-- Ejecutar: mysql -u root -p forbids_bd < backend/scripts/demo_data.sql

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM product_chat_messages;
DELETE FROM comments;
DELETE FROM favorites;
DELETE FROM bids;
DELETE FROM products;
DELETE FROM users WHERE username <> 'admin';

UPDATE users
SET email = 'admin@forbids.local',
    password = '$2a$10$7EArf3JXt3OnwPXSx/TpZ.xKw44UNYZqO6ihJYr9kY2sUZfKjDS96',
    role = 'ADMIN',
    banned = 0
WHERE username = 'admin';

INSERT INTO users (username, email, password, role, banned) VALUES
(
  'alvaro',
  'munoz.fernandez.alvaro@iescamas.es',
  '$2a$10$m159Fxx3zb7UznM4S0cMru42lV/UL4y5AHaZq/Ke97L86sKO9dso.',
  'USER',
  0
),
(
  'lucia',
  'lucia.demo@iescamas.es',
  '$2a$10$m159Fxx3zb7UznM4S0cMru42lV/UL4y5AHaZq/Ke97L86sKO9dso.',
  'USER',
  0
);

SET @alvaro_id = (SELECT id FROM users WHERE username = 'alvaro');
SET @lucia_id = (SELECT id FROM users WHERE username = 'lucia');

INSERT INTO products (
  title,
  description,
  starting_price,
  image_url,
  category,
  created_at,
  end_at,
  closed,
  owner_id
) VALUES
(
  'Bicicleta de montaña BTwin',
  'Bicicleta de montaña BTwin talla M, 21 velocidades. Revisada hace un mes, cambio de pastillas incluido. Ideal para salidas de fin de semana.',
  120.00,
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
  'SPORTS',
  NOW(),
  '2026-06-15 20:00:00',
  0,
  @alvaro_id
),
(
  'Portátil Lenovo IdeaPad i5',
  'Lenovo IdeaPad con Intel i5, 8 GB RAM y SSD 256 GB. Windows 11, batería en buen estado. Perfecto para clases y proyectos de DAW.',
  350.00,
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  'ELECTRONICS',
  NOW(),
  '2026-06-20 21:00:00',
  0,
  @alvaro_id
),
(
  'Libro Clean Code (edición en español)',
  'Ejemplar en buen estado, subrayado en algunas páginas. Muy útil para la asignatura de programación y el proyecto intermodular.',
  25.00,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
  'BOOKS',
  NOW(),
  '2026-06-10 19:30:00',
  0,
  @lucia_id
),
(
  'Chaqueta vaquera Levi''s',
  'Chaqueta vaquera Levi''s talla L, poco uso. Sin manchas ni roturas. Entrega en mano en Sevilla o envío por acuerdo.',
  40.00,
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
  'FASHION',
  NOW(),
  '2026-06-25 22:00:00',
  0,
  @lucia_id
);

-- Corrección UTF-8 (Windows / consola sin tildes)
UPDATE products SET title = CONVERT(UNHEX('42696369636C657461206465206D6F6E7461C3B16E20425477696E') USING utf8mb4),
  description = CONVERT(UNHEX('42696369636C657461206465206D6F6E746120425477696E2074616C6C61204D2C2032312076656C6F636964616465732E205265766973616461206861636520756E206D65732C2063616D62696F2064652070617374696C6C617320696E636C7569646F2E20496465616C20706172612073616C696461732064652066696E2064652073656D616E612E') USING utf8mb4)
WHERE title LIKE 'Bicicleta de monta%';

UPDATE products SET title = CONVERT(UNHEX('506F7274C3A174696C204C656E6F766F2049646561506164206935') USING utf8mb4),
  description = CONVERT(UNHEX('4C656E6F766F204964656150616420636F6E20496E74656C2069352C20382047422052414D207920535344203235362047422E2057696E646F77732031312C206261746572C3AD6120656E206275656E2065737461646F2E20506572666563746F207061726120636C6173657320792070726F796563746F73206465204441572E') USING utf8mb4)
WHERE title LIKE 'Port%til Lenovo%';

UPDATE products SET title = CONVERT(UNHEX('4C6962726F20436C65616E20436F646520286564696369C3B36E20656E2065737061C3B16F6C29') USING utf8mb4),
  description = CONVERT(UNHEX('456A656D706C617220656E206275656E2065737461646F2C2073756272617961646F20656E20616C67756E61732070C3A167696E61732E204D757920C3BA74696C2070617261206C6120617369676E61747572612064652070726F6772616D616369C3B36E207920656C2070726F796563746F20696E7465726D6F64756C61722E') USING utf8mb4)
WHERE title LIKE 'Libro Clean Code%';

SET FOREIGN_KEY_CHECKS = 1;
