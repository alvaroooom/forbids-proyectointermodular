-- ForBids — volcado completo de la base de datos (esquema + datos)
-- Proyecto intermodular 2º DAW — Álvaro Muñoz, IES Camas
--
-- Importar:
--   mysql -u root -p < forbids.sql
-- o desde MySQL Workbench: Server > Data Import > Import from Self-Contained File

CREATE DATABASE IF NOT EXISTS `forbids_bd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `forbids_bd`;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: forbids_bd
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `bidder_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmtrc6tnwawlpk1u2km6qnxbha` (`bidder_id`),
  KEY `FKhtewr5n8ee2tlu0rj67d6y14p` (`product_id`),
  CONSTRAINT `FKhtewr5n8ee2tlu0rj67d6y14p` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKmtrc6tnwawlpk1u2km6qnxbha` FOREIGN KEY (`bidder_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6uv0qku8gsu6x1r2jkrtqwjtn` (`product_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`),
  KEY `FK7h839m3lkvhbyv3bcdv7sm4fj` (`parent_comment_id`),
  CONSTRAINT `FK6uv0qku8gsu6x1r2jkrtqwjtn` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FK7h839m3lkvhbyv3bcdv7sm4fj` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgh1s14hhb9qb8p2do933hscsf` (`user_id`,`product_id`),
  KEY `FK6sgu5npe8ug4o42bf9j71x20c` (`product_id`),
  CONSTRAINT `FK6sgu5npe8ug4o42bf9j71x20c` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2026-05-26 17:25:27',0,1),(2,'2','chat reset admin uploads','SQL','V2__chat_reset_admin_uploads.sql',-1338370289,'root','2026-05-26 17:25:28',203,1),(3,'3','june auction deadlines','SQL','V3__june_auction_deadlines.sql',-1972117805,'root','2026-05-26 19:58:15',77,1),(4,'4','ensure admin account','SQL','V4__ensure_admin_account.sql',227734376,'root','2026-05-26 20:05:17',84,1),(5,'5','fix admin password hash','SQL','V5__fix_admin_password_hash.sql',180953253,'root','2026-06-03 07:21:26',90,1),(6,'6','remove email features','SQL','V6__remove_email_features.sql',-616175322,'root','2026-06-03 07:21:27',220,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_chat_messages`
--

DROP TABLE IF EXISTS `product_chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_chat_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `sender_username` varchar(50) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_chat_messages_user` (`user_id`),
  KEY `idx_chat_messages_product_id` (`product_id`),
  CONSTRAINT `fk_chat_messages_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_chat_messages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_chat_messages`
--

LOCK TABLES `product_chat_messages` WRITE;
/*!40000 ALTER TABLE `product_chat_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `starting_price` decimal(12,2) NOT NULL,
  `title` varchar(120) NOT NULL,
  `owner_id` bigint NOT NULL,
  `closed` bit(1) NOT NULL,
  `closed_at` datetime(6) DEFAULT NULL,
  `winner_id` bigint DEFAULT NULL,
  `end_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category` enum('ART','AUTOMOTIVE','BOOKS','ELECTRONICS','FASHION','HOME','MUSIC','OTHER','SPORTS','TOYS') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmodgy1j6kai83i3mweyp731qc` (`owner_id`),
  KEY `FKpkamw24b86bphr590ct3qsnb7` (`winner_id`),
  CONSTRAINT `FKmodgy1j6kai83i3mweyp731qc` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpkamw24b86bphr590ct3qsnb7` FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (18,'2026-06-03 09:40:45.000000','Bicicleta de monta BTwin talla M, 21 velocidades. Revisada hace un mes, cambio de pastillas incluido. Ideal para salidas de fin de semana.',120.00,'Bicicleta de montañn BTwin',26,_binary '\0',NULL,NULL,'2026-06-15 20:00:00.000000','https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800','SPORTS'),(19,'2026-06-03 09:40:45.000000','Lenovo IdeaPad con Intel i5, 8 GB RAM y SSD 256 GB. Windows 11, batería en buen estado. Perfecto para clases y proyectos de DAW.',350.00,'Portátil Lenovo IdeaPad i5',26,_binary '\0',NULL,NULL,'2026-06-20 21:00:00.000000','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800','ELECTRONICS'),(20,'2026-06-03 09:40:45.000000','Ejemplar en buen estado, subrayado en algunas páginas. Muy útil para la asignatura de programación y el proyecto intermodular.',25.00,'Libro Clean Code (edición en español)',27,_binary '\0',NULL,NULL,'2026-06-10 19:30:00.000000','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800','BOOKS'),(21,'2026-06-03 09:40:45.000000','Chaqueta vaquera Levi\'s talla L, poco uso. Sin manchas ni roturas. Entrega en mano en Sevilla o envío por acuerdo.',40.00,'Chaqueta vaquera Levi\'s',27,_binary '\0',NULL,NULL,'2026-06-25 22:00:00.000000','https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800','FASHION');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'USER',
  `banned` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (18,'admin@forbids.local','$2a$10$7EArf3JXt3OnwPXSx/TpZ.xKw44UNYZqO6ihJYr9kY2sUZfKjDS96','admin',NULL,'ADMIN',0),(26,'munoz.fernandez.alvaro@iescamas.es','$2a$10$m159Fxx3zb7UznM4S0cMru42lV/UL4y5AHaZq/Ke97L86sKO9dso.','alvaro',NULL,'USER',0),(27,'lucia.demo@iescamas.es','$2a$10$m159Fxx3zb7UznM4S0cMru42lV/UL4y5AHaZq/Ke97L86sKO9dso.','lucia',NULL,'USER',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'forbids_bd'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03  9:45:48
