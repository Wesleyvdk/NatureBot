-- CreateTable
CREATE TABLE "Levels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exp" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank" INTEGER NOT NULL,
    "cash" INTEGER NOT NULL,
    "bitcoin" INTEGER NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "turnedOn" BOOLEAN NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
