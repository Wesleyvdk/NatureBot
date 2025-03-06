/*
  Warnings:

  - A unique constraint covering the columns `[command]` on the table `CommandUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommandUsage_command_key" ON "CommandUsage"("command");
