import Fastify from "fastify";
import cors from "@fastify/cors";

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
  runtimeRoutes
} from "./pipeline/runtime/runtimeStore";

const app = Fastify();

const startServer = async () => {

  // =========================
  // ENABLE CORS
  // =========================

  await app.register(cors, {
    origin: true
  });

  // =========================
  // MAIN PIPELINE ROUTE
  // =========================

  app.post("/generate", async (request, reply) => {

    try {

      const body = request.body as {
        prompt: string;
      };

      // =========================
      // STAGE 1 — INTENT
      // =========================

      console.log("\n=========================");
      console.log("[Intent] Generating intent...");
      console.log("=========================");

      const intent = await generateIntent(body.prompt);

      console.log("[Intent] Success");


      // =========================
      // STAGE 2 — DESIGN
      // =========================

      console.log("\n=========================");
      console.log("[Design] Generating design...");
      console.log("=========================");

      const design = await generateDesign(intent);

      console.log("[Design] Success");


      // =========================
      // STAGE 3 — DB SCHEMA
      // =========================

      console.log("\n=========================");
      console.log("[DB] Generating DB schema...");
      console.log("=========================");

      const db = await generateDB(design);

      console.log("[DB] Success");


      // =========================
      // STAGE 4 — GENERATE PRISMA
      // =========================

      console.log("\n=========================");
      console.log("[Prisma] Generating prisma schema...");
      console.log("=========================");

      const prismaSchema =
        await generatePrismaSchema(db);

      await writePrismaFile(prismaSchema);

      console.log("[Prisma] schema.prisma created");


      // =========================
      // STAGE 5 — RUN MIGRATION
      // =========================

      console.log("\n=========================");
      console.log("[Prisma] Running migration...");
      console.log("=========================");

      await runMigration();

      console.log("[Prisma] Migration completed");


      // =========================
      // STAGE 6 — API SCHEMA
      // =========================

      console.log("\n=========================");
      console.log("[API] Generating API schema...");
      console.log("=========================");

      const api = await generateAPI(design);

      console.log("[API] Success");


      // =========================
      // STAGE 7 — UI SCHEMA
      // =========================

      console.log("\n=========================");
      console.log("[UI] Generating UI schema...");
      console.log("=========================");

      const ui = await generateUI(design);

      console.log("[UI] Success");


      // =========================
      // STAGE 8 — VALIDATION
      // =========================

      console.log("\n=========================");
      console.log("[Validation] Checking API ↔ DB consistency...");
      console.log("=========================");

      const validationErrors =
        validateApiDb(api, db);

      console.log("[Validation] Completed");


      // =========================
      // STAGE 9 — REPAIR ENGINE
      // =========================

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


      // =========================
      // STAGE 10 — RUNTIME EXECUTION
      // =========================

      console.log("\n=========================");
      console.log("[Runtime] Saving runtime routes...");
      console.log("=========================");

      setRuntimeRoutes(api.routes || []);

      console.log("[Runtime] Runtime routes saved");


      // =========================
      // FINAL RESPONSE
      // =========================

      return {

        success: validationErrors.length === 0,

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

          runtimeRoutes: runtimeRoutes.length

        }

      };

    } catch (error: any) {

      console.error("\n=========================");
      console.error("PIPELINE ERROR");
      console.error("=========================");

      console.error(error);

      return reply.status(500).send({

        success: false,

        error: error.message || "Internal Server Error"

      });

    }

  });


  // =========================
  // DYNAMIC RUNTIME ROUTES
  // =========================

  app.all("/api/*", async (request, reply) => {

    const url = request.url;

    const method = request.method;

    const route = runtimeRoutes.find((r: any) => {

      return (
        r.path === url &&
        r.method.toUpperCase() === method.toUpperCase()
      );

    });

    if (!route) {

      return reply.status(404).send({

        success: false,

        message: "Dynamic route not found"

      });

    }

    return {

      success: true,

      message: "Dynamic route executed",

      route

    };

  });


  // =========================
  // HEALTH ROUTE
  // =========================

  app.get("/", async () => {

    return {

      success: true,

      message: "AI App Compiler Backend Running"

    };

  });


  // =========================
  // START SERVER
  // =========================

  try {

    await app.listen({
      port: 4000
    });

    console.log("\n====================================");
    console.log("AI APP COMPILER RUNNING");
    console.log("====================================");

    console.log("POST:");
    console.log("http://localhost:4000/generate");

    console.log("====================================\n");

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

startServer();