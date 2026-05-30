export function validateApiDb(api: any, db: any) {

  const dbFields = new Set<string>();

  // collect DB fields
  db.tables.forEach((table: any) => {

    table.fields.forEach((field: any) => {

      dbFields.add(field.name);

    });

  });

  const errors: string[] = [];

  // validte API rquest fields
  api.routes.forEach((route: any) => {

    const request = route.request || {};

    Object.keys(request).forEach((field) => {

      if (!dbFields.has(field)) {

        errors.push(
          `Missing DB field: ${field}`
        );

      }

    });

  });

  return errors;
}