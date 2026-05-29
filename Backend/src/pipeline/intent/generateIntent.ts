import { IntentSchema } from "../../schemas/intent.schema";

export async function generateIntent(prompt: string) {

  console.log("[Mock AI] Generating intent");

  const mockIntent = {

    app_type: "CRM",

    modules: [
      "auth",
      "payments",
      "dashboard"
    ],

    roles: [
      "admin",
      "user"
    ],

    requirements: {
      authentication: true,
      payments: true
    }

  };

  return IntentSchema.parse(mockIntent);

}