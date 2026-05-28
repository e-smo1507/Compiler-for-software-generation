import fs from "fs";

export async function writePrismaFile(
  schema: string
) {

  fs.writeFileSync(
    "prisma/schema.prisma",
    schema
  );

  console.log(
    "[Prisma] schema.prisma written successfully"
  );

}