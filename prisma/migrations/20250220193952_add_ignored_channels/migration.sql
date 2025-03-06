-- AlterTable
ALTER TABLE "Levels" ALTER COLUMN "exp" SET DEFAULT 0,
ALTER COLUMN "level" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "IgnoredChannels" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "IgnoredChannels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IgnoredChannels_channelId_key" ON "IgnoredChannels"("channelId");
