export async function generateUI(design: any) {

  console.log("[Mock AI] Generating UI schema");

  return {

    pages: [

      {
        name: "Dashboard",

        components: [

          {
            type: "Card",

            props: {
              title: "Total Users",
              value: "120"
            }
          },

          {
            type: "Table",

            props: {
              columns: ["name", "email"]
            }
          }

        ]

      }

    ]

  };

}