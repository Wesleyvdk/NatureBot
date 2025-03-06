-- CreateTable
CREATE TABLE "CommandUsage" (
    "id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CommandUsage_pkey" PRIMARY KEY ("id")
);
