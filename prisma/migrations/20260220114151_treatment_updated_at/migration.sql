-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Treatment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "problemIds" TEXT NOT NULL,
    "czas" INTEGER NOT NULL,
    "cena_od" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Treatment" ("cena_od", "czas", "id", "nazwa", "opis", "problemIds") SELECT "cena_od", "czas", "id", "nazwa", "opis", "problemIds" FROM "Treatment";
DROP TABLE "Treatment";
ALTER TABLE "new_Treatment" RENAME TO "Treatment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
