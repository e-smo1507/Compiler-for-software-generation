import { execSync } from "child_process";

export async function runMigration() {

  try {

    console.log(
      "[Prisma] Running migration..."
    );

    execSync(
      "npx prisma migrate dev --name auto",
      {
        stdio: "inherit"
      }
    );

    console.log(
      "[Prisma] Migration completed"
    );

  } catch (error) {

    console.error(
      "[Prisma] Migration failed"
    );

    throw error;
  }
}