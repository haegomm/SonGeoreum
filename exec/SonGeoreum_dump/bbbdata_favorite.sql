-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: bbb-db.csj8ty7cbmhi.ap-northeast-2.rds.amazonaws.com    Database: bbbdata
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `word_id` bigint NOT NULL COMMENT 'word 테이블 PK',
  `user_id` bigint NOT NULL COMMENT 'user 테이블 PK',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  PRIMARY KEY (`id`),
  KEY `fk_word_favorite_id` (`word_id`),
  KEY `fk_user_favorite_id` (`user_id`),
  CONSTRAINT `fk_user_favorite_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_word_favorite_id` FOREIGN KEY (`word_id`) REFERENCES `word` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
INSERT INTO `favorite` VALUES (1,1,1,'2023-02-08 01:01:41'),(3,22,6,'2023-02-10 03:20:08'),(5,16,15,'2023-02-10 06:55:45'),(6,15,15,'2023-02-10 07:54:30'),(7,18,15,'2023-02-10 08:02:18'),(9,11,14,'2023-02-11 00:40:05'),(10,3,15,'2023-02-11 14:32:27'),(11,4,15,'2023-02-11 14:34:18'),(12,6,15,'2023-02-11 14:34:26'),(13,7,15,'2023-02-11 14:35:23'),(14,2,15,'2023-02-11 14:52:08'),(16,1,14,'2023-02-12 12:23:41'),(17,1,26,'2023-02-12 12:34:50'),(18,17,15,'2023-02-12 14:46:22'),(19,8,15,'2023-02-12 14:46:53'),(20,16,30,'2023-02-13 00:49:13'),(21,52,13,'2023-02-13 15:22:10'),(22,2,33,'2023-02-14 00:15:28'),(23,15,25,'2023-02-14 01:27:09'),(24,62,25,'2023-02-14 01:27:19'),(25,68,25,'2023-02-14 01:27:23'),(26,39,15,'2023-02-14 04:23:10'),(27,46,12,'2023-02-15 07:35:45'),(28,39,40,'2023-02-15 16:40:05');
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-16 23:22:19