CREATE TABLE `videoDownloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastAccessedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoDownloads_id` PRIMARY KEY(`id`),
	CONSTRAINT `video_download_user_video_unique` UNIQUE(`userId`,`videoId`)
);
--> statement-breakpoint
ALTER TABLE `videoDownloads` ADD CONSTRAINT `videoDownloads_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `videoDownloads` ADD CONSTRAINT `videoDownloads_videoId_videos_id_fk` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `video_download_user_idx` ON `videoDownloads` (`userId`,`createdAt`);