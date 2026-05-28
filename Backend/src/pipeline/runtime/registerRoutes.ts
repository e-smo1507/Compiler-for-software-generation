import { FastifyInstance } from "fastify";

export async function registerRoutes(
  app: FastifyInstance,
  apiSchema: any
) {

  const routes = apiSchema.routes || [];

  routes.forEach((route: any) => {

    app.route({

      method: route.method,

      url: route.path,

      handler: async (request, reply) => {

        return {

          success: true,

          dynamic: true,

          route: route.path,

          method: route.method,

          message: "Dynamic route executed"

        };

      }

    });

    console.log(
      `[Runtime] Registered ${route.method} ${route.path}`
    );

  });

}