SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `backlogs`
-- ----------------------------
DROP TABLE IF EXISTS `backlogs`;
CREATE TABLE `backlogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `story` varchar(1000) DEFAULT NULL,
  `demo` varchar(1000) DEFAULT NULL,
  `importance` int(11) NOT NULL DEFAULT '0',
  `note` varchar(1000) DEFAULT NULL,
  `productId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sprintId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `backlogs_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `enterprises`
-- ----------------------------
DROP TABLE IF EXISTS `enterprises`;
CREATE TABLE `enterprises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `enterprises`
-- ----------------------------
BEGIN;
INSERT INTO `enterprises` VALUES ('1', '江苏米果教育科技有限公司', '2016-08-06 02:28:20', '2016-08-06 04:47:32'), ('2', '测试企业', '2016-08-06 05:09:16', '2016-08-06 05:09:16'), ('3', '测试企业', '2016-08-06 05:15:28', '2016-08-06 05:15:28'), ('4', '个人', '2016-09-19 08:09:28', '2016-09-19 08:09:28'), ('5', '测试企业', '2017-03-02 12:58:00', '2017-03-02 12:58:00');
COMMIT;

-- ----------------------------
--  Table structure for `products`
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `progresses`
-- ----------------------------
DROP TABLE IF EXISTS `progresses`;
CREATE TABLE `progresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sprintBacklogId` int(11) NOT NULL,
  `progress` tinyint(4) NOT NULL,
  `updatedDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sprintId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sprintBacklogId` (`sprintBacklogId`),
  KEY `sprintId` (`sprintId`),
  CONSTRAINT `progresses_ibfk_1` FOREIGN KEY (`sprintBacklogId`) REFERENCES `sprint_backlogs` (`id`),
  CONSTRAINT `progresses_ibfk_2` FOREIGN KEY (`sprintId`) REFERENCES `sprints` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=700 DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `sprint_backlogs`
-- ----------------------------
DROP TABLE IF EXISTS `sprint_backlogs`;
CREATE TABLE `sprint_backlogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `story` varchar(1000) DEFAULT NULL,
  `demo` varchar(1000) DEFAULT NULL,
  `importance` int(11) NOT NULL DEFAULT '0',
  `note` varchar(1000) DEFAULT NULL,
  `sprintId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `estimate` float NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `progress` tinyint(4) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sprintId` (`sprintId`),
  KEY `userId` (`userId`),
  CONSTRAINT `sprint_backlogs_ibfk_1` FOREIGN KEY (`sprintId`) REFERENCES `sprints` (`id`),
  CONSTRAINT `sprint_backlogs_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=594 DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `sprints`
-- ----------------------------
DROP TABLE IF EXISTS `sprints`;
CREATE TABLE `sprints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `planningEndDate` datetime DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `sprints_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `sprints_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;


-- ----------------------------
--  Table structure for `teams`
-- ----------------------------
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`productId`,`userId`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isAdmin` tinyint(4) NOT NULL DEFAULT '0',
  `enterpriseId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `enterpriseId` (`enterpriseId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`enterpriseId`) REFERENCES `enterprises` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1', 'shannon', 'sunlong@migoedu.com', '$2a$08$0W2JNJ6MdJJJDiA2WTUPzeSf.Mm/XOQpCecjRloQC1Xc/cha8WiR2', '2016-07-26 06:59:34', '2016-07-26 07:02:20', '1', '1');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
