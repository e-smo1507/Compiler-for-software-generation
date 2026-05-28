export async function generatePrismaSchema(db: any) {

  let schema = `
// =========================
// PRISMA CLIENT
// =========================

generator client {
  provider = "prisma-client-js"
}

// =========================
// DATABASE
// =========================

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
`;

  const tables = db.tables || [];

  tables.forEach((table: any) => {

    const modelName =
      table.name.charAt(0).toUpperCase() +
      table.name.slice(1);

    schema += `

model ${modelName} {
  id Int @id @default(autoincrement())
`;

    const fields = table.fields || [];

    fields.forEach((field: any) => {

      schema += `  ${field.name} ${mapPrismaType(field.type)}\n`;

    });

    schema += `}\n`;

  });

  return schema;
}

function mapPrismaType(type: string) {

  switch (type) {

    case "string":
      return "String";

    case "number":
      return "Int";

    case "boolean":
      return "Boolean";

    default:
      return "String";
  }
}