export async function generateAPI(design: any) {

  console.log("[Mock AI] Generating API schema");

  return {

    routes: [

      {
        path: "/users",
        method: "GET"
      },

      {
        path: "/users",
        method: "POST"
      }

    ]

  };

}