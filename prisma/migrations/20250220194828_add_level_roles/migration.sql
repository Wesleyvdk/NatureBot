-- CreateTable
CREATE TABLE "LevelRoles" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "LevelRoles_pkey" PRIMARY KEY ("id")
);
