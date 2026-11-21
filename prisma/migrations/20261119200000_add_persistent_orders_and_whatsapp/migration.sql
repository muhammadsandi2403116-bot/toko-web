ALTER TABLE `User`
    ADD COLUMN `whatsapp` VARCHAR(20) NULL;

CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `transactionCode` VARCHAR(64) NOT NULL,
    `checkoutKey` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(20) NOT NULL,
    `items` JSON NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `originalTotal` INTEGER NOT NULL,
    `promotionDiscount` INTEGER NOT NULL,
    `bonusQuantity` INTEGER NOT NULL,
    `paymentMethod` VARCHAR(32) NOT NULL DEFAULT 'QRIS',
    `paymentStatus` VARCHAR(64) NOT NULL DEFAULT 'SIMULASI',
    `paymentProvider` VARCHAR(100) NULL,
    `senderName` VARCHAR(100) NULL,
    `paymentProofName` VARCHAR(255) NULL,
    `paymentProofData` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_transactionCode_key`(`transactionCode`),
    UNIQUE INDEX `Order_checkoutKey_key`(`checkoutKey`),
    INDEX `Order_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Order`
    ADD CONSTRAINT `Order_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
