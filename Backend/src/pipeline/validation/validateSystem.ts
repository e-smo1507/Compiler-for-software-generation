import { log } from "../../utils/logger";


export function validateSystem(uiSchema: any, apiSchema: any, dbSchema: any) {
  log("validation", "started");

  const errors: string[] = [];

  
  // 1. Collect DB fields
  
  const dbFields = new Set<string>();

  for (const table of dbSchema.tables) {
    for (const field of table.fields) {
      dbFields.add(field.name);
    }
  }

  
  // 2. Check API → DB mismatch

  for (const route of apiSchema.routes) {
    const urlParts = route.path.split("/");

    for (const part of urlParts) {
      if (part && !part.startsWith(":")) {
        const exists = Array.from(dbFields).includes(part);

        if (!exists && !["users", "subscriptions"].includes(part)) {
          errors.push(`API references unknown entity: ${part}`);
        }
      }
    }
  }

 
  // 3. Check UI → API mismatch
 
  for (const page of uiSchema.pages) {
    const route = page.route;

    const match = apiSchema.routes.find((r: any) =>
      r.path === route || r.path.includes(route.split("/:")[0])
    );

    if (!match) {
      errors.push(`UI page has no matching API route: ${route}`);
    }
  }

 
  // RESULT
  
  if (errors.length > 0) {
    log("validation", "failed", errors);
    return { valid: false, errors };
  }

  log("validation", "success");
  return { valid: true, errors: [] };
}