/*
  Warnings:

  - Added the required column `guildId` to the `Currency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Currency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `Levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Currency" ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Levels" ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "guildId" TEXT NOT NULL;
