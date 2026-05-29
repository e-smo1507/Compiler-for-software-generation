export async function generateDB(design: any) {

  console.log("[Mock AI] Generating DB schema");

  return {

    tables: [

      {
        name: "users",

        fields: [
          {
            name: "id",
            type: "Int"
          },

          {
            name: "email",
            type: "String"
          },

          {
            name: "name",
            type: "String"
          }
        ]
      }

    ]

  };

}