/*
  Warnings:

  - A unique constraint covering the columns `[date,user_id]` on the table `days` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `day_habits` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_day_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "day_habits_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_day_habits" ("day_id", "habit_id", "id") SELECT "day_id", "habit_id", "id" FROM "day_habits";
DROP TABLE "day_habits";
ALTER TABLE "new_day_habits" RENAME TO "day_habits";
CREATE UNIQUE INDEX "day_habits_day_id_habit_id_user_id_key" ON "day_habits"("day_id", "habit_id", "user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "days_date_user_id_key" ON "days"("date", "user_id");
