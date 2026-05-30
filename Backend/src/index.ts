import Fastify from "fastify";
import cors from "@fastify/cors";

import prisma from "./lib/prisma";

import { generateIntent } from "./pipeline/intent/generateIntent";
import { generateDesign } from "./pipeline/design/generateDesign";
import { generateDB } from "./pipeline/schema/generateDB";
import { generateAPI } from "./pipeline/schema/generateAPI";
import { generateUI } from "./pipeline/schema/generateUI";

import { validateApiDb } from "./pipeline/validation/validateApiDb";
import { repairDB } from "./pipeline/repair/repairDb";

import { generatePrismaSchema } from "./pipeline/runtime/generatePrisma";
import { writePrismaFile } from "./pipeline/runtime/writePrisma";
import { runMigration } from "./pipeline/runtime/runMigration";

import {
  setRuntimeRoutes,
  getRuntimeRoutes
} from "./pipeline/runtime/runtimeStore";

import { executeRuntimeRoute }
from "./pipeline/runtime/executeRuntimeRoute";

const app = Fastify();

const startServer = async () => {

 
  // ENABLE CORS
 

  await app.register(cors, {
    origin: true
  });

 
  // HEALTH ROUTE
  

  app.get("/", async () => {

    return {
      success: true,
      message: "AI App Compiler Backend Running"
    };

  });

 
  // GENERATE PIPELINE
 

  app.post("/generate", async (request, reply) => {

    try {

      const body = request.body as {
        prompt: string;
      };


      //— INTENT
    
      console.log("\n=========================");
      console.log("[Intent] Generating intent...");
      console.log("=========================");

      const intent =
        await generateIntent(body.prompt);

      console.log("[Intent] Success");

      
      //DESIGN
      

      console.log("\n=========================");
      console.log("[Design] Generating design...");
      console.log("=========================");

      const design =
        await generateDesign(intent);

      console.log("[Design] Success");

    
      // DB SCHEMA
    

      console.log("\n=========================");
      console.log("[DB] Generating DB schema...");
      console.log("=========================");

      const db =
        await generateDB(design);

      console.log("[DB] Success");

  
      // GENERATE PRISMA

      console.log("\n=========================");
      console.log("[Prisma] Generating prisma schema...");
      console.log("=========================");

      const prismaSchema =
        await generatePrismaSchema(db);

      await writePrismaFile(prismaSchema);

      console.log("[Prisma] schema.prisma created");

     
      // RUN MIGRATION
    

      console.log("\n=========================");
      console.log("[Prisma] Running migration...");
      console.log("=========================");

      await runMigration();

      console.log("[Prisma] Migration completed");

     
      //  API SCHEMA
    

      console.log("\n=========================");
      console.log("[API] Generating API schema...");
      console.log("=========================");

      const api =
        await generateAPI(design);

      console.log("[API] Success");

    
      // SAVE RUNTIME ROUTES
      

      setRuntimeRoutes(api.routes || []);

      console.log("[Runtime] Routes saved");

      console.log(
        "[Runtime] Current Routes:",
        getRuntimeRoutes()
      );

     
      // UI SCHEMA
      

      console.log("\n=========================");
      console.log("[UI] Generating UI schema...");
      console.log("=========================");

      const ui =
        await generateUI(design);

      console.log("[UI] Success");

   
      // VALIDATION
     

      console.log("\n=========================");
      console.log(
        "[Validation] Checking API ↔ DB consistency..."
      );
      console.log("=========================");

      const validationErrors =
        validateApiDb(api, db);

      console.log("[Validation] Completed");

      
      // REPAIR ENGINE
    

      let repairedDb = null;

      let repairApplied = false;

      if (validationErrors.length > 0) {

        repairApplied = true;

        console.log("\n=========================");
        console.log("[Repair] Validation failed");
        console.log("[Repair] Starting DB repair...");
        console.log("=========================");

        repairedDb = await repairDB(
          design,
          validationErrors
        );

        console.log("[Repair] DB repair completed");

      } else {

        console.log("\n=========================");
        console.log("[Repair] No repair needed");
        console.log("=========================");

      }

 

      return {

        success:
          validationErrors.length === 0,

        repairApplied,

        intent,

        design,

        db,

        prismaSchema,

        api,

        ui,

        validationErrors,

        repairedDb,

        runtime: {

          dynamicRoutesRegistered: true,

          prismaGenerated: true,

          migrationExecuted: true,

          runtimeRoutes:
            getRuntimeRoutes().length

        }

      };

    } catch (error: any) {

      console.error("\n=========================");
      console.error("PIPELINE ERROR");
      console.error("=========================");

      console.error(error);

      return reply.status(500).send({

        success: false,

        error:
          error.message ||
          "Internal Server Error"

      });

    }

  });

  
  // DYNAMIC RUNTIME ROUTES
 
  app.all("/runtime/*", async (request, reply) => {

    try {

      const url =
        request.url.replace("/runtime", "");

      const method =
        request.method.toUpperCase();

      const routes =
        getRuntimeRoutes();

      console.log("\n=========================");
      console.log("[Runtime] Incoming Request");
      console.log("=========================");

      console.log("Method:", method);
      console.log("URL:", url);

      console.log("\n[Runtime] Available Routes:");
      console.log(routes);

      const matchedRoute =
        routes.find((route: any) => {

          return (
            route.path.toLowerCase() ===
              url.toLowerCase()
            &&
            route.method.toUpperCase() ===
              method
          );

        });

     
      // ROUTE NOT FOUND
      

      if (!matchedRoute) {

        return reply.status(404).send({

          success: false,

          message:
            "Dynamic route not found",

          requested: {
            method,
            url
          },

          availableRoutes: routes

        });

      }

    
      // DYNAMIC DATABASE EXECUTION
   

      const body =
        request.body as any;

      const data =
        await executeRuntimeRoute(
          matchedRoute,
          method,
          body
        );

   
      // SUCCESS RESPONSE
      

      return {

        success: true,

        message:
          "Dynamic runtime route working",

        runtimeRoute: matchedRoute,

        data

      };

    } catch (error: any) {

      console.error(error);

      return reply.status(500).send({

        success: false,

        error: error.message

      });

    }

  });

 
  // SHOW ALL RUNTIME ROUTES
 

  app.get("/runtime-routes", async () => {

    return {

      success: true,

      routes: getRuntimeRoutes()

    };

  });


  // TEST DATABASE ROUTE
 

  app.get("/db-test", async () => {

    const users =
      await prisma.users.findMany();

    return {

      success: true,

      users

    };

  });

 
  // CREATE TEST USER
  
  app.post("/create-user", async (request) => {

    const body = request.body as {
      email: string;
      name: string;
    };

    const user =
      await prisma.users.create({

        data: {
          email: body.email,
          name: body.name
        }

      });

    return {

      success: true,

      user

    };

  });

 
  // START SERVER
  
  try {

    await app.listen({
      port: 4000
    });

    console.log("\n====================================");
    console.log("AI APP COMPILER RUNNING");
    console.log("====================================");

    console.log("POST:");
    console.log(
      "http://localhost:4000/generate"
    );

    console.log("\nRUNTIME APIs:");
    console.log(
      "GET http://localhost:4000/runtime/users"
    );

    console.log(
      "POST http://localhost:4000/runtime/users"
    );

    console.log(
      "PUT http://localhost:4000/runtime/users"
    );

    console.log(
      "DELETE http://localhost:4000/runtime/users"
    );

    console.log("\nSHOW ROUTES:");
    console.log(
      "GET http://localhost:4000/runtime-routes"
    );

    console.log("\nDATABASE TEST:");
    console.log(
      "GET http://localhost:4000/db-test"
    );

    console.log("\nCREATE USER:");
    console.log(
      "POST http://localhost:4000/create-user"
    );

    console.log("====================================\n");

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

startServer();