"use client";

import { useState } from "react";

import {
  CheckCircle,
  Loader2,
  Database,
  Brain,
  Shield,
  Cpu,
  Globe,
  Server,
  Terminal,
  UserPlus,
  Users
} from "lucide-react";

export default function Home() {

  const [prompt, setPrompt] =
    useState("Build CRM with auth and payments");

  const [result, setResult] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [runtimeResult, setRuntimeResult] =
    useState<any>(null);

  const [runtimeRoutes, setRuntimeRoutes] =
    useState<any>(null);

  const [logs, setLogs] =
    useState<string[]>([]);

  const [progress, setProgress] =
    useState(0);

  
  // USER STATES

  const [users, setUsers] =
    useState<any[]>([]);

  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

 
  // ADD LOG

  const addLog = (message: string) => {

    setLogs(prev => [...prev, message]);

  };

  
  // GENERATE APP

  const generateApp = async () => {

    try {

      setLoading(true);

      setProgress(0);

      setResult(null);

      setRuntimeResult(null);

      setLogs([]);

      addLog("Starting AI compiler pipeline...");

      setProgress(10);

      addLog("Generating intent...");

      const response = await fetch(
        "http://localhost:4000/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt })
        }
      );

      setProgress(40);

      if (!response.ok) {

        throw new Error(
          "Backend request failed"
        );

      }

      addLog("Generating schemas...");

      const data = await response.json();

      setProgress(70);

      setResult(data);

      addLog("Validation completed");

      addLog("Runtime routes registered");

      
      // FETCH RUNTIME ROUTES

      const routesResponse = await fetch(
        "http://localhost:4000/runtime-routes"
      );

      const routesData =
        await routesResponse.json();

      setRuntimeRoutes(routesData);

   
      // LOAD USERS

      await loadUsers();

      setProgress(100);

      addLog("Pipeline finished successfully");

    } catch (error: any) {

      console.error(error);

      addLog(
        `Pipeline failed: ${error.message}`
      );

    } finally {

      setLoading(false);

    }

  };


  // TEST RUNTIME API

  const testRuntimeApi = async () => {

    try {

      addLog("Testing runtime API...");

      const response = await fetch(
        "http://localhost:4000/runtime/users"
      );

      const data = await response.json();

      setRuntimeResult(data);

      addLog("Runtime API working");

    } catch (error: any) {

      console.error(error);

      addLog(
        `Runtime API failed: ${error.message}`
      );

    }

  };


  // CREATE USER

  const createUser = async () => {

    try {

      addLog("Creating user...");

      const response = await fetch(
        "http://localhost:4000/runtime/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            name
          })
        }
      );

      const data = await response.json();

      console.log(data);

      addLog("User created successfully");

      setEmail("");

      setName("");

      await loadUsers();

    } catch (error: any) {

      console.error(error);

      addLog(
        `Create user failed: ${error.message}`
      );

    }

  };


  // LOAD USERS

  const loadUsers = async () => {

    try {

      addLog("Loading users from database...");

      const response = await fetch(
        "http://localhost:4000/runtime/users"
      );

      const data = await response.json();

      setUsers(data.data || []);

      addLog("Users loaded successfully");

    } catch (error: any) {

      console.error(error);

      addLog(
        `Load users failed: ${error.message}`
      );

    }

  };

  return (

    <main className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}

      <div className="mb-10">

        <div className="flex items-center gap-4">

          <Globe className="w-12 h-12 text-blue-500" />

          <div>

            <h1 className="text-6xl font-bold">
              AI App Compiler
            </h1>

            <p className="text-zinc-400 mt-2">
              Intent → Design → Schemas → Validation → Runtime
            </p>

          </div>

        </div>

      </div>

      {/* PROMPT */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4">
          App Prompt
        </h2>

        <textarea
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          className="w-full h-40 bg-black border border-zinc-700 rounded-xl p-4 outline-none"
        />

        <button
          onClick={generateApp}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
        >

          {loading && (
            <Loader2 className="animate-spin" />
          )}

          {loading
            ? "Compiling..."
            : "Generate App"}

        </button>

        {/* PROGRESS BAR */}

        {
          loading && (

            <div className="mt-4">

              <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">

                <div
                  className="bg-blue-500 h-4 transition-all duration-500"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

              <div className="text-sm text-zinc-400 mt-2">
                Pipeline Progress: {progress}%
              </div>

            </div>

          )
        }

      </div>

      {/* SUCCESS BANNER */}

      {
        result?.success && (

          <div className="mb-6 border border-green-700 bg-green-950 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <CheckCircle className="text-green-400" />

              <div>

                <div className="font-bold text-lg">
                  AI App Generated Successfully
                </div>

                <div className="text-green-300 text-sm">
                  Runtime APIs, Prisma schema,
                  validation, and database completed.
                </div>

              </div>

            </div>

          </div>

        )
      }

      {/* PIPELINE STATUS */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <StatusCard
          icon={<Brain />}
          title="Intent"
          active={!!result?.intent}
        />

        <StatusCard
          icon={<Cpu />}
          title="Design"
          active={!!result?.design}
        />

        <StatusCard
          icon={<Database />}
          title="Database"
          active={!!result?.db}
        />

        <StatusCard
          icon={<Shield />}
          title="Validation"
          active={!!result}
        />

        <StatusCard
          icon={<Server />}
          title="Runtime"
          active={!!runtimeRoutes}
        />

      </div>

      {/* RESULTS */}

      {result && (

        <div className="space-y-6">

          <PipelineCard
            title="Intent"
            data={result.intent}
          />

          <PipelineCard
            title="Design"
            data={result.design}
          />

          <PipelineCard
            title="Database Schema"
            data={result.db}
          />

          <PipelineCard
            title="Prisma Schema"
            data={result.prismaSchema}
          />

          <PipelineCard
            title="API Schema"
            data={result.api}
          />

          <PipelineCard
            title="UI Schema"
            data={result.ui}
          />

          <PipelineCard
            title="Runtime"
            data={result.runtime}
          />

          {/* VALIDATION */}

          <div
            className={`border rounded-2xl p-6 ${
              result.validationErrors.length === 0
                ? "border-green-700 bg-green-950"
                : "border-red-700 bg-red-950"
            }`}
          >

            <h2 className="text-2xl font-bold mb-4">
              Validation
            </h2>

            <pre className="overflow-auto text-sm">
              {JSON.stringify(
                result.validationErrors,
                null,
                2
              )}
            </pre>

          </div>

          {/* RUNTIME ROUTES */}

          {runtimeRoutes && (

            <PipelineCard
              title="Runtime Routes"
              data={runtimeRoutes}
            />

          )}

          {/* CREATE USER */}

          <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <UserPlus className="text-blue-500" />

              <h2 className="text-2xl font-bold">
                Create User
              </h2>

            </div>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none"
              />

              <div className="flex gap-3">

                <button
                  onClick={createUser}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
                >
                  Create User
                </button>

                <button
                  onClick={loadUsers}
                  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
                >
                  Load Users
                </button>

              </div>

            </div>

          </div>

          {/* USERS */}

          <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <Users className="text-green-500" />

              <h2 className="text-2xl font-bold">
                Database Users
              </h2>

            </div>

            <div className="mb-4 text-zinc-400">
              Total Users: {users.length}
            </div>

            <div className="space-y-3">

              {users.length === 0 && (

                <div className="text-zinc-400">
                  No users found
                </div>

              )}

              {users.map((user, index) => (

                <div
                  key={index}
                  className="border border-zinc-700 rounded-2xl p-5 bg-black hover:border-blue-500 transition"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="text-xl font-bold">
                        {user.name}
                      </div>

                      <div className="text-zinc-400">
                        {user.email}
                      </div>

                    </div>

                    <div className="bg-blue-600 px-4 py-2 rounded-xl text-sm">
                      User #{user.id}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* RUNTIME API TESTER */}

          <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <Terminal className="text-green-500" />

              <h2 className="text-2xl font-bold">
                Runtime API Tester
              </h2>

            </div>

            <button
              onClick={testRuntimeApi}
              className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
            >
              Test Runtime API
            </button>

            {runtimeResult && (

              <pre className="mt-4 overflow-auto text-sm">
                {JSON.stringify(
                  runtimeResult,
                  null,
                  2
                )}
              </pre>

            )}

          </div>

        </div>

      )}

      {/* LOGS */}

      <div className="mt-10 border border-zinc-800 bg-zinc-900 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-4">

          <Terminal className="text-blue-500" />

          <h2 className="text-2xl font-bold">
            Compiler Logs
          </h2>

        </div>

        <div className="space-y-2 text-sm text-green-400 font-mono">

          {logs.map((log, index) => (

            <div key={index}>
              {">"} {log}
            </div>

          ))}

        </div>

      </div>

    </main>

  );

}


// PIPELINE CARD

function PipelineCard({
  title,
  data
}: {
  title: string;
  data: any;
}) {

  return (

    <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <pre className="overflow-auto text-sm whitespace-pre-wrap">
        {typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2)}
      </pre>

    </div>

  );

}


// STATUS CARD

function StatusCard({
  icon,
  title,
  active
}: {
  icon: any;
  title: string;
  active: boolean;
}) {

  return (

    <div
      className={`rounded-2xl p-5 border ${
        active
          ? "bg-green-950 border-green-700"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >

      <div className="flex items-center justify-between">

        <div>

          <div className="text-zinc-400 text-sm">
            Stage
          </div>

          <div className="text-xl font-bold">
            {title}
          </div>

        </div>

        <div>

          {active
            ? <CheckCircle />
            : icon}

        </div>

      </div>

    </div>

  );

}