export async function generateDesign(intent: any) {

  console.log("[Mock AI] Generating design");

  return {

    entities: [
      "User",
      "Subscription"
    ],

    flows: [
      "login",
      "upgrade_plan"
    ],

    permissions: {
      admin: ["*"],
      user: ["read"]
    }

  };

}