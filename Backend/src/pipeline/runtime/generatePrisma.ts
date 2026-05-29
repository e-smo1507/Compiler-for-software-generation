export async function generatePrismaSchema(db: any): Promise<string> {

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

    // Convert table name to model name
    // users -> Users

    const modelName =
      table.name.charAt(0).toUpperCase() +
      table.name.slice(1);

    schema += `

model ${modelName} {
  id Int @id @default(autoincrement())
`;

    const fields = table.fields || [];

    fields.forEach((field: any) => {

      // Prevent duplicate id field
      if (field.name.toLowerCase() === "id") {
        return;
      }

      schema += `  ${field.name} ${mapPrismaType(field.type)}\n`;

    });

    schema += `}\n`;

  });

  return schema;
}

function mapPrismaType(type: string): string {

  switch (type.toLowerCase()) {

    case "string":
      return "String";

    case "number":
    case "int":
      return "Int";

    case "boolean":
      return "Boolean";

    case "float":
      return "Float";

    default:
      return "String";
  }
}