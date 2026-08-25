CREATE TABLE `accountDeletionRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('requested','processing','completed','cancelled') NOT NULL DEFAULT 'requested',
	`reason` varchar(500),
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `accountDeletionRequests_id` PRIMARY KEY(`id`),
	CONSTRAINT `accountDeletionRequests_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `contentReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterUserId` int NOT NULL,
	`videoId` int,
	`postId` int,
	`reason` enum('copyright','harassment','sexual','drugs','violence','privacy','spam','other') NOT NULL,
	`details` text,
	`status` enum('open','under_review','resolved','dismissed') NOT NULL DEFAULT 'open',
	`moderatorNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionEntitlements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','signal_plus','founder_circle') NOT NULL DEFAULT 'free',
	`status` enum('active','trialing','past_due','cancelled') NOT NULL DEFAULT 'active',
	`provider` varchar(32),
	`providerCustomerId` varchar(128),
	`providerSubscriptionId` varchar(128),
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptionEntitlements_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptionEntitlements_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `accountDeletionRequests` ADD CONSTRAINT `accountDeletionRequests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_reporterUserId_users_id_fk` FOREIGN KEY (`reporterUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_videoId_videos_id_fk` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentReports` ADD CONSTRAINT `contentReports_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptionEntitlements` ADD CONSTRAINT `subscriptionEntitlements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `content_reports_status_idx` ON `contentReports` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `content_reports_reporter_idx` ON `contentReports` (`reporterUserId`,`createdAt`);