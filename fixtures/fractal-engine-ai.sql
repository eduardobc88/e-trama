# ************************************************************
# Sequel Ace SQL dump
# Version 20096
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 0.0.0.0 (MySQL 9.5.0)
# Database: fractal-engine-ai
# Generation Time: 2026-02-12 19:00:22 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table area
# ------------------------------------------------------------

DROP TABLE IF EXISTS `area`;

CREATE TABLE `area` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT '',
  `gd_folder_id` varchar(300) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_name_uk` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;

INSERT INTO `area` (`created_at`, `updated_at`, `deleted_at`, `id`, `name`, `description`, `gd_folder_id`)
VALUES
	('2025-10-16 14:30:12','2025-10-16 14:30:12','0000-00-00 00:00:00',1,'fractal','fractal','1GHySSiZKGZb1ZjcWUL9gBev-3S3q2xO4');

/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_notification_report_uk` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table custom_entity
# ------------------------------------------------------------

DROP TABLE IF EXISTS `custom_entity`;

CREATE TABLE `custom_entity` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT '',
  `resource_name` varchar(100) NOT NULL,
  `prefix` varchar(50) NOT NULL,
  `suffix` varchar(50) NOT NULL,
  `number` int unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_custom_entity_name_uk` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table custom_entity_field
# ------------------------------------------------------------

DROP TABLE IF EXISTS `custom_entity_field`;

CREATE TABLE `custom_entity_field` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `custom_entity_id` int unsigned NOT NULL,
  `custom_field_id` int unsigned NOT NULL,
  `active` tinyint DEFAULT '0',
  `is_unique` tinyint(1) DEFAULT '0',
  `is_search` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_custom_entity_field_uk` (`custom_entity_id`,`custom_field_id`,`deleted_at`),
  KEY `fkc_custom_entity_field_custom_field_id` (`custom_field_id`),
  CONSTRAINT `fkc_custom_entity_field_custom_entity_id` FOREIGN KEY (`custom_entity_id`) REFERENCES `custom_entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_custom_entity_field_custom_field_id` FOREIGN KEY (`custom_field_id`) REFERENCES `custom_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table custom_field
# ------------------------------------------------------------

DROP TABLE IF EXISTS `custom_field`;

CREATE TABLE `custom_field` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT '',
  `type` enum('file','text','number','checkbox','date','list','entity','textarea') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `custom_list_id` int unsigned DEFAULT NULL,
  `custom_entity_id` int unsigned DEFAULT NULL,
  `active` tinyint DEFAULT '0',
  `custom_entity_field_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_custom_field_name_type_uk` (`name`,`type`,`deleted_at`),
  KEY `fkc_custom_field_custom_entity_id` (`custom_entity_id`),
  KEY `fkc_custom_field_custom_list_id` (`custom_list_id`),
  KEY `fkc_custom_field_custom_entity_field_id` (`custom_entity_field_id`),
  CONSTRAINT `fkc_custom_field_custom_entity_field_id` FOREIGN KEY (`custom_entity_field_id`) REFERENCES `custom_entity_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_custom_field_custom_entity_id` FOREIGN KEY (`custom_entity_id`) REFERENCES `custom_entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_custom_field_custom_list_id` FOREIGN KEY (`custom_list_id`) REFERENCES `custom_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table custom_list
# ------------------------------------------------------------

DROP TABLE IF EXISTS `custom_list`;

CREATE TABLE `custom_list` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT '',
  `data` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_custom_list_name_uk` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table feedback
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `feedback_title` varchar(200) NOT NULL,
  `feedback_description` text NOT NULL,
  `category_id` int unsigned NOT NULL,
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fkc_user_id` (`user_id`),
  KEY `fkc_feedback_category_id` (`category_id`),
  CONSTRAINT `fkc_feedback_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table file
# ------------------------------------------------------------

DROP TABLE IF EXISTS `file`;

CREATE TABLE `file` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(200) NOT NULL,
  `file_title` varchar(255) DEFAULT '',
  `file_description` varchar(255) DEFAULT '',
  `file_mime_type` varchar(50) DEFAULT '',
  `file_size` varchar(100) DEFAULT '',
  `user_id` int unsigned NOT NULL,
  `gd_file_id` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fkc_file_user_id` (`user_id`),
  KEY `fk_file_area` (`area_id`),
  CONSTRAINT `fk_file_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_file_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table language
# ------------------------------------------------------------

DROP TABLE IF EXISTS `language`;

CREATE TABLE `language` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `language_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_language_uk` (`language_name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;

INSERT INTO `language` (`created_at`, `updated_at`, `deleted_at`, `id`, `language_name`)
VALUES
	('2021-10-14 06:42:48','2021-10-14 06:42:48','0000-00-00 00:00:00',1,'en'),
	('2021-10-14 06:42:48','2025-01-29 00:11:19','0000-00-00 00:00:00',2,'es');

/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table language_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `language_message`;

CREATE TABLE `language_message` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `language_id` int unsigned NOT NULL,
  `language_message_key` varchar(200) NOT NULL,
  `language_message_value` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_language_message_uk` (`language_id`,`language_message_key`,`deleted_at`),
  CONSTRAINT `fkc_language_message_language_id` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `language_message` WRITE;
/*!40000 ALTER TABLE `language_message` DISABLE KEYS */;

INSERT INTO `language_message` (`created_at`, `updated_at`, `deleted_at`, `id`, `language_id`, `language_message_key`, `language_message_value`)
VALUES
	('2021-12-01 03:18:41','2025-01-29 00:11:19','0000-00-00 00:00:00',1,2,'files','archivos'),
	('2021-12-01 03:18:41','2025-01-29 00:11:19','0000-00-00 00:00:00',2,2,'dashboard','tablero'),
	('2021-12-09 02:44:22','2025-01-29 00:11:19','0000-00-00 00:00:00',3,2,'users','usuarios'),
	('2022-11-16 17:00:43','2025-01-29 00:11:19','0000-00-00 00:00:00',4,2,'documents','oficios'),
	('2022-11-16 17:01:03','2025-01-29 00:11:19','0000-00-00 00:00:00',5,2,'new','nuevo'),
	('2022-11-16 17:01:43','2025-01-29 00:11:19','0000-00-00 00:00:00',6,2,'resources','recursos'),
	('2022-11-16 17:01:43','2025-01-29 00:11:19','0000-00-00 00:00:00',7,2,'sections','secciones'),
	('2022-11-16 17:02:52','2025-01-29 00:11:19','0000-00-00 00:00:00',9,2,'profile','perfil'),
	('2022-11-16 17:03:27','2025-01-29 00:11:19','0000-00-00 00:00:00',10,2,'Search','buscador'),
	('2023-02-04 23:59:57','2025-01-29 00:11:19','0000-00-00 00:00:00',11,2,'district user id ref','distrital'),
	('2023-02-05 00:03:29','2025-01-29 00:11:19','0000-00-00 00:00:00',12,2,'circumscription user id ref','circunscripción'),
	('2023-02-05 00:03:29','2025-01-29 00:11:19','0000-00-00 00:00:00',13,2,'state user id ref','estatal'),
	('2023-02-05 00:03:29','2025-01-29 00:11:19','0000-00-00 00:00:00',14,2,'town user id ref','municipal'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',15,2,'updated at','actualizado'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',16,2,'created at','creado'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',17,2,'voter key','clave de elector'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',18,2,'address','dirección'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',19,2,'section','sección'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',20,2,'email','correo'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',21,2,'phone','teléfono'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',22,2,'maternal surname','apellido materno'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',23,2,'paternal surname','apellido paterno'),
	('2023-02-05 00:06:36','2025-01-29 00:11:19','0000-00-00 00:00:00',24,2,'name','nombre'),
	('2023-02-05 00:07:25','2025-01-29 00:11:19','0000-00-00 00:00:00',25,2,'actions','acciones'),
	('2023-02-05 00:08:09','2025-01-29 00:11:19','0000-00-00 00:00:00',26,2,'some keyword','escribe una palabra'),
	('2023-02-05 00:09:05','2025-01-29 00:11:19','0000-00-00 00:00:00',28,2,'update','actualizar'),
	('2023-02-05 00:09:05','2025-01-29 00:11:19','0000-00-00 00:00:00',29,2,'delete','eliminar'),
	('2023-02-05 00:09:51','2025-01-29 00:11:19','0000-00-00 00:00:00',30,2,'district progress','avance distrital'),
	('2023-02-05 00:10:36','2025-01-29 00:11:19','0000-00-00 00:00:00',31,2,'end date','fecha final'),
	('2023-02-05 00:10:36','2025-01-29 00:11:19','0000-00-00 00:00:00',32,2,'start date','fecha inicio'),
	('2023-02-05 00:10:36','2025-01-29 00:11:19','0000-00-00 00:00:00',33,2,'town','municipio'),
	('2023-02-05 00:10:36','2025-01-29 00:11:19','0000-00-00 00:00:00',34,2,'state','estado'),
	('2023-02-05 00:10:46','2025-01-29 00:11:19','0000-00-00 00:00:00',35,2,'refresh','actualizar'),
	('2023-02-05 00:11:21','2025-01-29 00:11:19','0000-00-00 00:00:00',36,2,'second','seg'),
	('2023-02-05 00:11:21','2025-01-29 00:11:19','0000-00-00 00:00:00',37,2,'minute','min'),
	('2023-02-05 00:11:21','2025-01-29 00:11:19','0000-00-00 00:00:00',38,2,'hour','hr'),
	('2023-02-05 00:11:47','2025-01-29 00:11:19','0000-00-00 00:00:00',39,2,'accept','aceptar'),
	('2023-02-05 00:11:47','2025-01-29 00:11:19','0000-00-00 00:00:00',40,2,'cancel','cancelar'),
	('2023-02-05 00:34:26','2025-01-29 00:11:19','0000-00-00 00:00:00',41,2,'first name','nombre'),
	('2023-02-05 00:34:34','2025-01-29 00:11:19','0000-00-00 00:00:00',42,2,'last name','apellido'),
	('2023-02-05 00:34:52','2025-01-29 00:11:19','0000-00-00 00:00:00',43,2,'active','activo'),
	('2023-02-05 00:35:08','2025-01-29 00:11:19','0000-00-00 00:00:00',44,2,'status','estatus'),
	('2023-02-05 00:36:59','2025-01-29 00:11:19','0000-00-00 00:00:00',46,2,'select town','selecciona un municipio'),
	('2023-02-05 00:36:59','2025-01-29 00:11:19','0000-00-00 00:00:00',47,2,'select state','selección un estado'),
	('2023-02-05 00:37:53','2025-01-29 00:11:19','0000-00-00 00:00:00',48,2,'select an end date','selecciona una fecha'),
	('2023-02-05 00:37:53','2025-01-29 00:11:19','0000-00-00 00:00:00',49,2,'select an start date','selecciona una fecha'),
	('2023-02-05 00:42:15','2025-01-29 00:11:19','0000-00-00 00:00:00',50,2,'rows from','registros desde'),
	('2023-02-05 00:42:32','2025-01-29 00:11:19','0000-00-00 00:00:00',51,2,'to','a'),
	('2023-02-05 00:42:55','2025-01-29 00:11:19','0000-00-00 00:00:00',52,2,'of','de'),
	('2023-02-05 00:42:55','2025-01-29 00:11:19','0000-00-00 00:00:00',53,2,'page','página'),
	('2023-02-05 00:43:57','2025-01-29 00:11:19','0000-00-00 00:00:00',54,2,'required','requerido'),
	('2023-02-05 00:44:09','2025-01-29 00:11:19','0000-00-00 00:00:00',55,2,'at least 2 characters','al menos 2 caracteres'),
	('2023-02-05 00:45:32','2025-01-29 00:11:19','0000-00-00 00:00:00',56,2,'language','lenguaje'),
	('2023-02-05 00:45:32','2025-01-29 00:11:19','0000-00-00 00:00:00',57,2,'select language','selecciona un lenguaje'),
	('2023-02-05 00:46:01','2025-01-29 00:11:19','0000-00-00 00:00:00',58,2,'set avatar','cargar avatar'),
	('2023-02-05 00:46:12','2025-01-29 00:11:19','0000-00-00 00:00:00',59,2,'user','usuario'),
	('2023-02-05 00:49:17','2025-01-29 00:11:19','0000-00-00 00:00:00',60,2,'title','título'),
	('2023-02-05 00:49:43','2025-01-29 00:11:19','0000-00-00 00:00:00',61,2,'notifications','historial'),
	('2023-02-05 00:50:26','2025-01-29 00:11:19','0000-00-00 00:00:00',62,2,'logout','salir'),
	('2023-02-05 00:56:04','2025-01-29 00:11:19','0000-00-00 00:00:00',63,2,'languages','lenguajes'),
	('2023-02-05 00:56:31','2025-01-29 00:11:19','0000-00-00 00:00:00',64,2,'feedbacks','retroalimentaciones'),
	('2023-02-05 00:56:56','2025-01-29 00:11:19','0000-00-00 00:00:00',65,2,'user id ref','creado por'),
	('2023-02-05 00:57:28','2025-01-29 00:11:19','0000-00-00 00:00:00',66,2,'description','descripción'),
	('2023-02-05 01:19:27','2025-01-29 00:11:19','0000-00-00 00:00:00',67,2,'download','descargar'),
	('2023-02-05 01:23:44','2025-01-29 00:11:19','0000-00-00 00:00:00',68,2,'state progress','avance estatal'),
	('2023-02-05 01:23:44','2025-01-29 00:11:19','0000-00-00 00:00:00',69,2,'town progress','avance municipal'),
	('2023-02-05 16:10:57','2025-01-29 00:11:19','0000-00-00 00:00:00',70,2,'save','guardar'),
	('2023-02-12 13:19:24','2025-01-29 00:11:19','0000-00-00 00:00:00',71,2,'insert a number','inserta un número'),
	('2023-02-12 13:19:24','2025-01-29 00:11:19','0000-00-00 00:00:00',72,2,'district','distrito'),
	('2023-02-12 13:20:32','2025-01-29 00:11:19','0000-00-00 00:00:00',73,2,'state goals','metas'),
	('2023-02-12 13:23:51','2025-01-29 00:11:19','0000-00-00 00:00:00',74,2,'goal','meta'),
	('2023-02-12 19:56:21','2025-01-29 00:11:19','0000-00-00 00:00:00',75,2,'general progress','progreso general'),
	('2023-02-12 19:56:21','2025-01-29 00:11:19','0000-00-00 00:00:00',76,2,'total progress','progreso total'),
	('2023-02-12 19:56:21','2025-01-29 00:11:19','0000-00-00 00:00:00',77,2,'total goal','meta'),
	('2023-02-12 19:56:21','2025-01-29 00:11:19','0000-00-00 00:00:00',78,2,'total records','total de registros'),
	('2023-02-12 19:56:21','2025-01-29 00:11:19','0000-00-00 00:00:00',79,2,'brigade progress','progreso de brigada por municipio'),
	('2023-02-12 19:56:42','2025-01-29 00:11:19','0000-00-00 00:00:00',80,2,'none','ninguno'),
	('2023-03-02 12:45:49','2025-01-29 00:11:19','0000-00-00 00:00:00',81,2,'section progress','sección (total)'),
	('2023-03-02 19:09:29','2025-01-29 00:11:19','0000-00-00 00:00:00',82,2,'brigade section progress','progreso de brigada'),
	('2023-03-02 19:19:07','2025-01-29 00:11:19','0000-00-00 00:00:00',83,2,'section goals','metas por sección'),
	('2023-03-02 19:19:07','2025-01-29 00:11:19','0000-00-00 00:00:00',84,2,'town goals','metas por municipio'),
	('2023-04-12 15:32:55','2025-01-29 00:11:19','0000-00-00 00:00:00',85,2,'used materials','materiales usados'),
	('2023-04-12 15:34:49','2025-01-29 00:11:19','0000-00-00 00:00:00',86,2,'used material','material usado'),
	('2023-04-29 10:36:24','2025-01-29 00:11:19','0000-00-00 00:00:00',87,2,'select a goal','selecciona una meta'),
	('2023-05-05 10:26:36','2025-01-29 00:11:19','0000-00-00 00:00:00',88,2,'brigade progress report','progreso de brigadistas'),
	('2023-05-05 10:26:36','2025-01-29 00:11:19','0000-00-00 00:00:00',89,2,'goal progress report','progreso de metas'),
	('2023-05-05 10:26:36','2025-01-29 00:11:19','0000-00-00 00:00:00',90,2,'town cut','advance municipal'),
	('2023-05-05 10:26:36','2025-01-29 00:11:19','0000-00-00 00:00:00',91,2,'state cut','avance estatal'),
	('2023-05-29 10:09:01','2025-01-29 00:11:19','0000-00-00 00:00:00',92,2,'week report','reporte semanal'),
	('2023-05-29 10:11:02','2025-01-29 00:11:19','0000-00-00 00:00:00',93,2,'state name','estado'),
	('2023-05-29 10:12:54','2025-01-29 00:11:19','0000-00-00 00:00:00',94,2,'b promoted total','promovidos (semana 2)'),
	('2023-05-29 10:12:54','2025-01-29 00:11:19','0000-00-00 00:00:00',95,2,'a promoted total','promovidos (semana 1)'),
	('2023-05-29 10:12:54','2025-01-29 00:11:19','0000-00-00 00:00:00',96,2,'promoted total','promovidos (total)'),
	('2023-05-29 10:12:54','2025-01-29 00:11:19','0000-00-00 00:00:00',97,2,'brigade total','brigadistas (total)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',98,2,'b microperforated total','microperforados (semana 2)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',99,2,'a microperforated total','microperforados (semana 1)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',100,2,'b wall total','bardas (semana 2)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',101,2,'a wall total','bardas (semana 1)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',102,2,'b paper total','periódicos (semana 2)'),
	('2023-05-29 10:16:32','2025-01-29 00:11:19','0000-00-00 00:00:00',103,2,'a paper total','periódicos (semana 1)'),
	('2023-05-29 10:17:06','2025-01-29 00:11:19','0000-00-00 00:00:00',104,2,'b textil total','textiles (semana 2)'),
	('2023-05-29 10:17:06','2025-01-29 00:11:19','0000-00-00 00:00:00',105,2,'a textil total','textiles (semana 1)'),
	('2023-05-29 10:19:58','2025-01-29 00:11:19','0000-00-00 00:00:00',106,2,'brigade name','nombre'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',107,2,'textil goal','textiles (meta)'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',108,2,'microperforated goal','microperforados (meta)'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',109,2,'wall goal','bardas (meta)'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',110,2,'paper goal','periódicos (meta)'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',111,2,'promoted goal','promovidos (meta)'),
	('2023-05-29 10:22:19','2025-01-29 00:11:19','0000-00-00 00:00:00',112,2,'town id ref','municipio'),
	('2023-05-29 10:25:19','2025-01-29 00:11:19','0000-00-00 00:00:00',113,2,'microperforated total','microperforados (total)'),
	('2023-05-29 10:25:19','2025-01-29 00:11:19','0000-00-00 00:00:00',114,2,'textil total','textiles (total)'),
	('2023-05-29 10:25:19','2025-01-29 00:11:19','0000-00-00 00:00:00',115,2,'wall total','bardas (total)'),
	('2023-05-29 10:25:19','2025-01-29 00:11:19','0000-00-00 00:00:00',116,2,'paper total','periódicos (total)'),
	('2023-05-29 10:25:46','2025-01-29 00:11:19','0000-00-00 00:00:00',117,2,'town id','id'),
	('2023-05-29 10:31:33','2025-01-29 00:11:19','0000-00-00 00:00:00',118,2,'problematic','problemática'),
	('2023-05-29 10:36:11','2025-01-29 00:11:19','0000-00-00 00:00:00',119,2,'position','puesto'),
	('2023-05-29 10:36:26','2025-01-29 00:11:19','0000-00-00 00:00:00',120,2,'new password','nueva contraseña'),
	('2023-05-29 10:36:41','2025-01-29 00:11:19','0000-00-00 00:00:00',121,2,'user name','nombre de usuario'),
	('2023-05-29 10:37:03','2025-01-29 00:11:19','0000-00-00 00:00:00',122,2,'role id','rol id'),
	('2023-05-29 10:40:11','2025-01-29 00:11:19','0000-00-00 00:00:00',130,2,'send','enviar'),
	('2023-05-29 10:40:11','2025-01-29 00:11:19','0000-00-00 00:00:00',131,2,'something about service','algo acerca del servicio'),
	('2023-05-29 10:41:00','2025-01-29 00:11:19','0000-00-00 00:00:00',132,2,'write your feedback','tu opinión'),
	('2023-06-13 12:45:35','2025-01-29 00:11:19','0000-00-00 00:00:00',133,2,'spectacular','espectacular'),
	('2023-06-13 12:45:35','2025-01-29 00:11:19','0000-00-00 00:00:00',134,2,'canva','lona'),
	('2023-06-13 12:45:35','2025-01-29 00:11:19','0000-00-00 00:00:00',135,2,'wall','barda'),
	('2023-06-20 19:16:47','2025-01-29 00:11:19','0000-00-00 00:00:00',136,2,'deleted','eliminado'),
	('2025-01-28 23:10:46','2025-01-29 00:11:19','0000-00-00 00:00:00',137,2,'expense ordinary','gasto ordinario'),
	('2025-01-28 23:11:14','2025-01-29 00:11:19','0000-00-00 00:00:00',138,2,'export','exportar'),
	('2025-01-28 23:12:13','2025-01-29 00:11:19','0000-00-00 00:00:00',139,2,'updated by','actualizado por'),
	('2025-01-28 23:12:13','2025-01-29 00:11:19','0000-00-00 00:00:00',140,2,'created by','creado por'),
	('2025-01-28 23:14:50','2025-01-29 00:11:19','0000-00-00 00:00:00',141,2,'quantity','cantidad'),
	('2025-01-29 00:05:46','2025-01-29 00:11:19','0000-00-00 00:00:00',142,2,'columns','columnas'),
	('2025-01-29 00:11:19','2025-01-29 00:11:19','0000-00-00 00:00:00',146,2,'activity','actividad');

/*!40000 ALTER TABLE `language_message` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mysql_migrations_347ertt3e
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mysql_migrations_347ertt3e`;

CREATE TABLE `mysql_migrations_347ertt3e` (
  `timestamp` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  UNIQUE KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `notification_title` varchar(150) NOT NULL,
  `notification_description` varchar(255) DEFAULT '',
  `notification_type` enum('log','error') NOT NULL,
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fkc_notification_user_id` (`user_id`),
  KEY `fk_notification_area` (`area_id`),
  CONSTRAINT `fk_notification_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_notification_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;

INSERT INTO `notification` (`created_at`, `updated_at`, `deleted_at`, `id`, `user_id`, `notification_title`, `notification_description`, `notification_type`, `area_id`)
VALUES
	('2025-11-17 15:47:21','2025-11-17 15:47:21','0000-00-00 00:00:00',1,1,'session started','','log',NULL),
	('2025-11-17 15:47:37','2025-11-17 15:47:37','0000-00-00 00:00:00',2,1,'session started','','log',NULL),
	('2025-11-17 16:32:19','2025-11-17 16:32:19','0000-00-00 00:00:00',3,1,'user updated','','log',NULL),
	('2025-11-17 19:14:15','2025-11-17 19:14:15','0000-00-00 00:00:00',4,1,'session ended','','log',NULL),
	('2025-11-17 19:18:15','2025-11-17 19:18:15','0000-00-00 00:00:00',5,1,'session started','','log',NULL),
	('2025-11-17 19:24:30','2025-11-17 19:24:30','0000-00-00 00:00:00',6,1,'profile updated','','log',NULL),
	('2025-11-17 19:24:46','2025-11-17 19:24:46','0000-00-00 00:00:00',7,1,'user updated','','log',NULL),
	('2025-11-17 19:25:03','2025-11-17 19:25:03','0000-00-00 00:00:00',8,1,'file deleted','','log',NULL),
	('2025-11-17 19:25:03','2025-11-17 19:25:03','0000-00-00 00:00:00',9,1,'file deleted','','log',NULL),
	('2025-11-17 19:28:16','2025-11-17 19:28:16','0000-00-00 00:00:00',10,1,'session ended','','log',NULL),
	('2025-11-17 19:28:24','2025-11-17 19:28:24','0000-00-00 00:00:00',11,1,'session started','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',12,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',13,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',14,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',15,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',16,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',17,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',18,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',19,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',20,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',21,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',22,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',23,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',24,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',25,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',26,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',27,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',28,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',29,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',30,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',31,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:29:39','2025-11-17 19:29:39','0000-00-00 00:00:00',32,1,'Resource deleted','','log',NULL),
	('2025-11-17 19:30:26','2025-11-17 19:30:26','0000-00-00 00:00:00',33,1,'session ended','','log',NULL),
	('2025-11-17 19:30:32','2025-11-17 19:30:32','0000-00-00 00:00:00',34,1,'session started','','log',NULL),
	('2025-11-17 19:31:10','2025-11-17 19:31:10','0000-00-00 00:00:00',35,1,'role updated','','log',NULL),
	('2025-11-17 19:35:12','2025-11-17 19:35:12','0000-00-00 00:00:00',36,1,'session ended','','log',NULL),
	('2025-11-17 19:39:13','2025-11-17 19:39:13','0000-00-00 00:00:00',37,1,'session started','','log',NULL),
	('2025-11-19 12:28:50','2025-11-19 12:28:50','0000-00-00 00:00:00',38,1,'session started','','log',NULL),
	('2025-11-24 12:30:33','2025-11-24 12:30:33','0000-00-00 00:00:00',39,1,'role updated','','log',NULL),
	('2025-11-24 12:30:41','2025-11-24 12:30:41','0000-00-00 00:00:00',40,1,'Resource deleted','','log',NULL),
	('2025-11-24 12:31:55','2025-11-24 12:31:55','0000-00-00 00:00:00',41,1,'session ended','','log',NULL),
	('2025-11-24 15:03:19','2025-11-24 15:03:19','0000-00-00 00:00:00',42,1,'session started','','log',NULL),
	('2025-11-24 15:03:30','2025-11-24 15:03:30','0000-00-00 00:00:00',43,1,'profile updated','','log',NULL),
	('2025-11-24 15:13:59','2025-11-24 15:13:59','0000-00-00 00:00:00',44,1,'session ended','','log',NULL),
	('2025-11-24 15:16:58','2025-11-24 15:16:58','0000-00-00 00:00:00',45,1,'session started','','log',NULL),
	('2025-11-24 15:19:01','2025-11-24 15:19:01','0000-00-00 00:00:00',46,1,'profile updated','','log',NULL),
	('2025-11-24 15:19:11','2025-11-24 15:19:11','0000-00-00 00:00:00',47,1,'profile updated','','log',NULL),
	('2025-11-24 15:25:15','2025-11-24 15:25:15','0000-00-00 00:00:00',48,1,'session ended','','log',NULL);

/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table post
# ------------------------------------------------------------

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `user_id` int unsigned NOT NULL,
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `file_id` int unsigned NOT NULL,
  `excerpt` text,
  `content` text,
  `file_ids` text,
  `status` enum('publish','pending') DEFAULT 'publish',
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_post_uk` (`title`,`deleted_at`),
  KEY `fkc_post_user_id` (`user_id`),
  KEY `fkc_post_file_id` (`file_id`),
  KEY `fkc_post_category_id` (`category_id`),
  KEY `fk_post_area` (`area_id`),
  CONSTRAINT `fk_post_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_post_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_post_file_id` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_post_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `resource`;

CREATE TABLE `resource` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `path` varchar(255) DEFAULT '',
  `menu` tinyint DEFAULT '0',
  `records` tinyint DEFAULT '0',
  `icon` varchar(100) DEFAULT 'stack',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_resource_uk` (`name`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;

INSERT INTO `resource` (`created_at`, `updated_at`, `deleted_at`, `id`, `name`, `description`, `path`, `menu`, `records`, `icon`)
VALUES
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',1,'dashboard','dashboard','/dashboard/[0-9]*(/)*',1,0,'dashboard'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',2,'profile','profile','/profile/',1,0,'stack'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',3,'user','user','/user/[0-9]*(/)*',1,1,'person'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',4,'file','file','/file/[0-9]*(/)*',1,1,'perm_media'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',5,'role','role','/role/[0-9]*(/)*',1,1,'security'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',6,'resource','resource','/resource/[0-9]*(/)*',1,1,'stack'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',7,'search','search','/search/?s=[dDw0-9a-zA-Z]+',0,0,'stack'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',8,'language','language','/language/[0-9]*(/)*',1,1,'language'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',9,'notification','notification','/notification/[0-9]*(/)*',0,0,'stack'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',10,'feedback','feedback','feedback',1,1,'feedback'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',11,'post','post','post',1,1,'description'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',12,'category','category','category',1,1,'category'),
	('2023-12-31 18:11:39','2023-12-31 18:11:39','0000-00-00 00:00:00',13,'blog','blog','blog',1,1,'archive'),
	('2024-01-01 16:47:04','2024-01-01 16:47:04','0000-00-00 00:00:00',14,'custom-entity','custom-entity','custom-entity',1,1,'dashboard_customize'),
	('2024-01-01 16:47:21','2024-01-01 16:47:21','0000-00-00 00:00:00',15,'custom-list','custom-list','custom-list',1,1,'dashboard_customize'),
	('2024-01-01 16:47:28','2024-01-01 16:47:28','0000-00-00 00:00:00',16,'custom-field','custom-field','custom-field',1,1,'dashboard_customize'),
	('2024-01-16 00:56:59','2024-01-16 00:56:59','0000-00-00 00:00:00',17,'area','area','area',1,1,'category'),
	('2024-04-14 15:14:30','2024-04-14 15:14:30','0000-00-00 00:00:00',18,'custom-entity-record','custom-entity-record','custom-entity-record',0,0,''),
	('2025-09-25 12:53:56','2025-10-27 12:38:48','0000-00-00 00:00:00',19,'settings','settings','/settings/',1,0,'settings');

/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(200) NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_role_uk` (`user_id`,`role_name`,`deleted_at`),
  CONSTRAINT `fkc_role_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_name`, `user_id`)
VALUES
	('2021-10-14 06:42:48','2025-11-24 12:30:33','0000-00-00 00:00:00',1,'administrator',1);

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role_resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role_resource`;

CREATE TABLE `role_resource` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `resource_id` int unsigned NOT NULL,
  `permission` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_role_resource_uk` (`role_id`,`resource_id`,`deleted_at`),
  KEY `fkc_role_resource_resource_id` (`resource_id`),
  CONSTRAINT `fkc_role_resource_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_role_resource_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `role_resource` WRITE;
/*!40000 ALTER TABLE `role_resource` DISABLE KEYS */;

INSERT INTO `role_resource` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_id`, `resource_id`, `permission`)
VALUES
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',1,1,1,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',2,1,4,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',3,1,3,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',4,1,5,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',5,1,6,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',6,1,7,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',7,1,8,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',8,1,2,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',9,1,9,'c,r,u,d,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',10,1,10,'c,r,v'),
	('2023-12-31 18:16:33','2025-11-24 12:30:33','0000-00-00 00:00:00',11,1,12,'c,r,u,d,v'),
	('2024-01-01 17:15:06','2025-11-24 12:30:33','0000-00-00 00:00:00',12,1,14,'c,r,u,d,v'),
	('2024-01-01 17:15:06','2025-11-24 12:30:33','0000-00-00 00:00:00',13,1,15,'c,r,u,d,v'),
	('2024-01-01 17:15:06','2025-11-24 12:30:33','0000-00-00 00:00:00',14,1,16,'c,r,u,d,v'),
	('2024-01-16 00:57:46','2025-11-24 12:30:33','0000-00-00 00:00:00',15,1,17,'c,r,u,d,v'),
	('2025-09-25 12:54:25','2025-11-24 12:30:33','0000-00-00 00:00:00',16,1,19,'r,u,v');

/*!40000 ALTER TABLE `role_resource` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table settings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `use_google_drive` tinyint(1) DEFAULT '0',
  `gd_folder_id` text,
  `gd_auth_client_email` text,
  `gd_auth_private_key` text,
  `items_by_page` smallint DEFAULT '60',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_dashboard_setting_uk` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;

INSERT INTO `settings` (`created_at`, `updated_at`, `deleted_at`, `id`, `use_google_drive`, `gd_folder_id`, `gd_auth_client_email`, `gd_auth_private_key`, `items_by_page`)
VALUES
	('2025-09-24 13:00:55','2025-10-16 14:51:37','0000-00-00 00:00:00',1,0,'1nzYcQuWwoHaRHHoL92JwUhdbvKva1I-Z','fractal@noble-network-474516-a5.iam.gserviceaccount.com','-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJwh4boT1bGC2k\nD5NzdoJAle3EEBCLAQO6gZrUPFBlrMZE4SEvqCVRtUDYa3krLo5Qt85p9EYXLHP5\nKqmQIbbcGBJ4mG/TAmpd5lHOQqw25k4tXb7hcfnQoBuCWFRnPLYWMyZRPt6qNY7c\nzsh0xNu2C7vSPwDfyA25GwOEH4EiRP3TuCEKcQZ13D+WlaViajS5bPb0fIFYrAj9\noDuwxmHxqTpgS6IAXAXvwM6p2fpP2TpIiUe8F+6Watu/wdGDkNTksfv4s0bsIlBI\nmEbXyBqHoPL6k3GaGSzg1V9FGqovox6tzAz/V+sZschlOAMEnd1o8+kOTMyWC0xR\nkmBcGUOTAgMBAAECggEACClQOetYGxfZyiABno+wgw0YOxQT8sqk4bCTAyzxo9ib\nS/BUi0eWCm9hLaONixCwqhUdW5v7SoU+Ui8jHSMw4tYBVioRT/MAdCp/Vv12Orb1\n7A/8rqhKeVNDXSsrqDdvNmuufdfct24HFulqPwBPYPL/Vr4uentgYINZ2AFTWxxK\nJ/RWWpb48CKnhWcSMUj0Y7PFJfYL2BWrpABWWseF+t6pK+3hTvCJTtrMD5z4fP3M\n1hCUbuXG7+EOixwGahLGIQnBBsqy5nvuqKsrivms9Ey/vBPAqq//3mCz+JjlX8Ns\nxYPBUkUmON4Y1KibBlU0JjXZJL4Myh+F0aHBfvGsaQKBgQDvAcJUfzOZPqqCNWra\ngo71i3xKP0K1s47BkXbsKz80cinJnO/izdXGf1U+9w4oN5EuumLjdpU0OEHcy2wX\nyfJ7y2KLf1q1isrfeIPB+aHCdGisgVB2N8YilvHGc+VbtLE/QPuJmIAIvTn0MKW0\n1b36FfEjViYrtWu9brvjfTYxqwKBgQDYGmKAc7452ToyEV+02ZkAkup7aRNyGEcf\nqJeISmz+hMNcBQtsrEKNlku5cHwk/pVTI6mihrGCJtbsQiNwgiJjDXGufchFIS9J\nsxFsskF/FaAD6f9c2eCss64epjIjhoZ2QVNKDjs6reU9X1so3dbuO9R9HswXCmJq\nnGLgQ+0duQKBgFFkOfdocfvn2U0KP981wtVfsO3f6SnTgfPtQ6BdgeKsVgqwhQip\nq/ky96a/n3SWp7xQAMkRYvIrjlJQe/kF7qu1sVNsBUn5f+jmM4hlKG7+EX9dcjcv\n+ytgV+mLIjo+qHWv/Xj4E/Hl7sx3nJaei1mVC09LUShlWdFi2l04ELKNAoGBAKSC\n+Ye2FRNu1km1RjmkCUERluXaKQ6LguGL88eyeOUNZrePs5HIVWX6C62g/zEeicjf\n9kye41UkgisbcmU8/DaRzoA6ixJtX9VoN5Sa4xd++/De2yLxToPKyXvVo4e96nDt\n7B0NVnOmXERrajdjIjL8YxfZMR89LYzhfrghncopAoGBANqO6l6k+7RTGuoU9E10\n7nnCmeOM2omLnHghs1P8XNafTPPFJVXpC6WkfaPPvTJ7HB238ThiYMZAZbko1TMQ\n5vsZNL88zkT3GJ2giQ3x7c4mUDxrCvCn0N/9VRUXa3b3O0jeVoix8wK78gJF5FR6\nW6WQN5UZhwQSaVv4sp6t2Dgj\n-----END PRIVATE KEY-----\n',100);

/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT '0000-00-00 00:00:00',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `language_id` int unsigned NOT NULL,
  `profile_file_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned NOT NULL DEFAULT '1',
  `user_name` varchar(100) NOT NULL,
  `user_pass` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_first_name` varchar(100) NOT NULL,
  `user_last_name` varchar(100) NOT NULL,
  `user_active` tinyint unsigned DEFAULT '1',
  `user_status` enum('offline','online') DEFAULT 'offline',
  `position` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `file_ids` text,
  `theme` tinyint DEFAULT '0',
  `qr_code` varchar(255) DEFAULT '',
  `user_token` text,
  `area_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_user_uk` (`user_name`,`user_email`,`deleted_at`),
  KEY `fkc_user_role_id` (`role_id`),
  KEY `fkc_user_language_id` (`language_id`),
  KEY `fkc_user_profile_file_id` (`profile_file_id`),
  KEY `fkc_user_user_id` (`user_id`),
  KEY `fk_feedback_area` (`area_id`),
  CONSTRAINT `fk_category_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_feedback_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_area` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_language_id` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_profile_file_id` FOREIGN KEY (`profile_file_id`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkc_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`created_at`, `updated_at`, `deleted_at`, `id`, `role_id`, `language_id`, `profile_file_id`, `user_id`, `user_name`, `user_pass`, `user_email`, `user_first_name`, `user_last_name`, `user_active`, `user_status`, `position`, `phone`, `file_ids`, `theme`, `qr_code`, `user_token`, `area_id`)
VALUES
	('2021-10-14 06:42:49','2021-10-14 06:42:49','0000-00-00 00:00:00',1,1,1,NULL,1,'administrator','$2b$12$wpES/ggOX3CNDQw7W1OPqeOdBHKFkQOvF00ipqGbZAnzVPyPggXte','eduardobc.88@gmail.com','Eduardo','Beltran Carbajal',1,'offline','developer','4431049977','[]',1,'',NULL,NULL);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
