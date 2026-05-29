const runtimeState = {
  routes: [] as any[]
};

export function setRuntimeRoutes(routes: any[]) {

  runtimeState.routes = routes;

  console.log(
    "[RuntimeStore] Saved Routes:",
    runtimeState.routes
  );

}

export function getRuntimeRoutes() {

  return runtimeState.routes;

}