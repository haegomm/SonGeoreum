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
-- Table structure for table `word`
--

DROP TABLE IF EXISTS `word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `word` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` varchar(20) NOT NULL COMMENT '이름',
  `content_url` varchar(200) NOT NULL COMMENT '수어 영상 URL',
  `category_id` bigint NOT NULL COMMENT 'category 테이블 PK',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `content_url` (`content_url`),
  KEY `fk_cateory_word_id` (`category_id`),
  CONSTRAINT `fk_cateory_word_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `word`
--

LOCK TABLES `word` WRITE;
/*!40000 ALTER TABLE `word` DISABLE KEYS */;
INSERT INTO `word` VALUES (1,'ㄱ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221635952_OWXO8MQ23.jpg/m51_7_i1.jpg?type=w165_fst&wm=N',1),(2,'ㄴ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221636105_WJKK5JTII.jpg/m51_7_i2.jpg?type=w165_fst&wm=N',1),(3,'ㄷ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221636373_0VMU2KKIF.jpg/m51_7_i3.jpg?type=w165_fst&wm=N',1),(4,'ㄹ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221638192_JHSG7B2L6.jpg/m51_7_i4.jpg?type=w165_fst&wm=N',1),(5,'ㅁ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221639489_8BTLK23Y7.jpg/m51_7_i5.jpg?type=w165_fst&wm=N',1),(6,'ㅂ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221640121_ASIC21XWI.jpg/m51_7_i6.jpg?type=w165_fst&wm=N',1),(7,'ㅅ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221640600_W3BQ4FGD7.jpg/m51_7_i7.jpg?type=w165_fst&wm=N',1),(8,'ㅇ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221641186_QDL66NEJB.jpg/m51_7_i8.jpg?type=w165_fst&wm=N',1),(9,'ㅈ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221641379_6S8VOSLRZ.jpg/m51_7_i9.jpg?type=w165_fst&wm=N',1),(10,'ㅊ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221643700_53FDKED97.jpg/m51_7_i10.jpg?type=w165_fst&wm=N',1),(11,'ㅋ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221643905_4AHTZD8JZ.jpg/m51_7_i11.jpg?type=w165_fst&wm=N',1),(12,'ㅌ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221644122_3ZJFUHDPC.jpg/m51_7_i12.jpg?type=w130_fst&wm=N',1),(13,'ㅍ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221644369_70KY0RZYV.jpg/m51_7_i13.jpg?type=w165_fst&wm=N',1),(14,'ㅎ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221646332_O0VBMPYFL.jpg/m51_7_i14.jpg?type=w165_fst&wm=N',1),(15,'ㅏ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221647198_5A7G7UIPQ.jpg/m51_7_i15.jpg?type=w165_fst&wm=N',2),(16,'ㅑ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221647449_7ERG0BSDO.jpg/m51_7_i16.jpg?type=w165_fst&wm=N',2),(17,'ㅓ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221648243_SK8OOJRTH.jpg/m51_7_i17.jpg?type=w165_fst&wm=N',2),(18,'ㅕ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221648948_WT6S9UR2G.jpg/m51_7_i18.jpg?type=w165_fst&wm=N',2),(19,'ㅗ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221649036_EBUFMI6ME.jpg/m51_7_i19.jpg?type=w165_fst&wm=N',2),(20,'ㅛ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650787_6RO5YG2SY.jpg/m51_7_i20.jpg?type=w165_fst&wm=N',2),(21,'ㅜ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650866_JAWFLSHIN.jpg/m51_7_i21.jpg?type=w165_fst&wm=N',2),(22,'ㅠ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650925_5FC94QFJP.jpg/m51_7_i22.jpg?type=w165_fst&wm=N',2),(23,'ㅡ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221651116_AR40ZMFUD.jpg/m51_7_i23.jpg?type=w130_fst&wm=N',2),(24,'ㅣ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221653281_6TXVS3W9H.jpg/m51_7_i24.jpg?type=w165_fst&wm=N',2),(25,'ㅐ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221653890_9F2FOG6R4.jpg/m51_7_i25.jpg?type=w165_fst&wm=N',2),(26,'ㅒ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221654159_CIOOEFKM0.jpg/m51_7_i26.jpg?type=w165_fst&wm=N',2),(27,'ㅔ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655307_HWM8GIKQU.jpg/m51_7_i27.jpg?type=w130_fst&wm=N',2),(28,'ㅖ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655476_AKZBG8CDX.jpg/m51_7_i28.jpg?type=w130_fst&wm=N',2),(29,'0','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655909_3VYQ8KWZG.jpg/m51_7_i29.jpg?type=w130_fst&wm=N',3),(30,'1','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657469_CBQSOA6GI.jpg/m51_7_i30.jpg?type=w130_fst&wm=N',3),(31,'2','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657647_9TQ6Z0TU7.jpg/m51_7_i31.jpg?type=w130_fst&wm=N',3),(32,'3','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657842_3KSB8I7QK.jpg/m51_7_i32.jpg?type=w130_fst&wm=N',3),(33,'4','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657899_G7GWVCY34.jpg/m51_7_i33.jpg?type=w130_fst&wm=N',3),(34,'5','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221700423_AKR6SWZQ5.jpg/m51_7_i34.jpg?type=w130_fst&wm=N',3),(35,'6','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221700705_SMUBJ90BZ.jpg/m51_7_i35.jpg?type=w130_fst&wm=N',3),(36,'7','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221701068_24THQP0GN.jpg/m51_7_i36.jpg?type=w130_fst&wm=N',3),(37,'8','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221702406_JQ0NTF3PQ.jpg/m51_7_i37.jpg?type=w130_fst&wm=N',3),(38,'9','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221702754_KFPI17OTD.jpg/m51_7_i38.jpg?type=w130_fst&wm=N',3),(39,'안녕하세요','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624421/MOV000244910_700X466.mp4',4),(40,'감사합니다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/632085/MOV000243986_700X466.mp4',4),(41,'죄송하다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/630183/MOV000253802_700X466.mp4',4),(42,'안녕히 계세요','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624422/MOV000246604_700X466.mp4',4),(43,'오랜만','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20190918/615385/MOV000245472_700X466.mp4',4),(44,'만나다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191029/632284/MOV000252208_700X466.mp4 ',4),(45,'어떻게','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200820/732339/MOV000257357_700X466.mp4',4),(46,'도움','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191010/626234/MOV000236648_700X466.mp4',4),(47,'아니다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191101/633271/MOV000260442_700X466.mp4',4),(48,'하지 마','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631969/MOV000246778_700X466.mp4',4),(49,'맞다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631894/MOV000241295_700X466.mp4',4),(50,'엄마','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624374/MOV000238631_700X466.mp4',5),(51,'아빠','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624399/MOV000239769_700X466.mp4',5),(52,'친구','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191015/627705/MOV000257451_700X466.mp4',5),(53,'절친하다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733298/MOV000258060_700X466.mp4',5),(54,'우정','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191024/630493/MOV000255166_700X466.mp4',5),(55,'같이','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191001/623710/MOV000240291_700X466.mp4',5),(56,'따로','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631887/MOV000240345_700X466.mp4',5),(57,'선생','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191029/632450/MOV000245908_700X466.mp4',5),(58,'좋다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/629987/MOV000259382_700X466.mp4',6),(59,'행복','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630748/MOV000237400_700X466.mp4',6),(60,'슬픔','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191016/628058/MOV000239357_700X466.mp4',6),(61,'걱정','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191007/625140/MOV000249112_700X466.mp4',6),(62,'배고프다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191017/628480/MOV000254728_700X466.mp4',6),(63,'졸리다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4',6),(64,'무섭다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630992/MOV000252416_700X466.mp4',6),(65,'그립다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191007/625117/MOV000249030_700X466.mp4',6),(66,'궁금하다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624431/MOV000248626_700X466.mp4',6),(67,'신기하다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630946/MOV000245688_700X466.mp4',6),(68,'맛있다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191014/627269/MOV000252525_700X466.mp4',6),(69,'괜찮다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/630119/MOV000249438_700X466.mp4',6),(70,'사랑','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191021/629620/MOV000253928_700X466.mp4',6),(71,'농담','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191011/626645/MOV000252448_700X466.mp4',6),(72,'가능','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/732879/MOV000249484_700X466.mp4',6);
/*!40000 ALTER TABLE `word` ENABLE KEYS */;
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

-- Dump completed on 2023-02-16 23:22:17
