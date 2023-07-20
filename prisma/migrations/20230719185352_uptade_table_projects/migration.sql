/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_link_key" ON "projects"("link");
