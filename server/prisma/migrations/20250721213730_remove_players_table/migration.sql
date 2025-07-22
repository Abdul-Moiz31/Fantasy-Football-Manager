/*
  Warnings:

  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `team_players` DROP FOREIGN KEY `team_players_player_id_fkey`;

-- DropIndex
DROP INDEX `team_players_player_id_fkey` ON `team_players`;

-- DropTable
DROP TABLE `players`;
