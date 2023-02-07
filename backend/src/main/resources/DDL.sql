CREATE DATABASE IF NOT EXISTS bbbdata;
USE bbbdata;

-- 카테고리 테이블

CREATE TABLE IF NOT EXISTS `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` VARCHAR(20) NOT NULL UNIQUE COMMENT '이름',
  `is_testable` CHAR(1) NOT NULL COMMENT '테스트 가능 여부(T : 가능, F : 불가능)',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- 단어 테이블

CREATE TABLE IF NOT EXISTS `word` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` VARCHAR(20) NOT NULL UNIQUE COMMENT '이름',
  `content_url` VARCHAR(200) NOT NULL UNIQUE COMMENT '수어 영상 URL',
  `category_id` BIGINT NOT NULL COMMENT 'category 테이블 PK',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cateory_word_id`
    FOREIGN KEY (`category_id`)
    REFERENCES `category` (`id`) ON UPDATE CASCADE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- 회원 테이블

CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `user_type` VARCHAR(15) NOT NULL COMMENT 'NORMAL:일반,  KAKAO:카카오톡',
  `email` VARCHAR(100) NULL UNIQUE COMMENT '일반 회원 아이디',
  `kakao_id` VARCHAR(100) NULL UNIQUE COMMENT '카카오톡 회원 아이디',
  `password` VARCHAR(200) NULL COMMENT '비밀번호',
  `nickname` VARCHAR(15) NOT NULL UNIQUE COMMENT '닉네임',
  `picture` VARCHAR(1000) NULL COMMENT '프로필 사진URL',
  `refresh_token` VARCHAR(200) NULL COMMENT 'refresh토큰',
  `level` INT NOT NULL DEFAULT 1 COMMENT '레벨',
  `experience` INT NOT NULL DEFAULT 0 COMMENT '경험치',
  `created_date` DATETIME NOT NULL DEFAULT NOW() COMMENT '가입일시',
  `role` VARCHAR(15) NOT NULL DEFAULT "ROLE_USER" COMMENT 'spring  security용 컬럼',
  PRIMARY KEY (`id`)
  )
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
  
  -- 나의 단어장 테이블
  
  CREATE TABLE IF NOT EXISTS `favorite` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `word_id` BIGINT NOT NULL COMMENT 'word 테이블 PK',
  `user_id` BIGINT NOT NULL COMMENT 'user 테이블 PK',
  `created_date` DATETIME NOT NULL DEFAULT NOW() COMMENT '생성일시',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_word_favorite_id`
    FOREIGN KEY (`word_id`)
    REFERENCES `word` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_user_favorite_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`) ON UPDATE CASCADE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- 게임 로그 테이블

  CREATE TABLE IF NOT EXISTS `gamelog` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `start_date` DATETIME NOT NULL COMMENT '시작일시',
  `end_date` DATETIME NOT NULL DEFAULT NOW() COMMENT '종료일시',
  `session_id` VARCHAR(100) NOT NULL COMMENT '세션 id',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- 회원 로그 테이블

  CREATE TABLE IF NOT EXISTS `gamelog_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `user_id` BIGINT NOT NULL COMMENT 'user 테이블 PK',
  `gamelog_id` BIGINT NOT NULL COMMENT 'gmaelog 테이블 PK',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_gamelogUser_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_gamelog_gamelogUser_id`
    FOREIGN KEY (`gamelog_id`)
    REFERENCES `gamelog` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;



