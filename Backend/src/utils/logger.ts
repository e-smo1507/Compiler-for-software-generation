export function log(stage: string, message: string, data?: any) {
  console.log(`
[${stage.toUpperCase()}] ${message}
${data ? JSON.stringify(data, null, 2) : ""}
  `);
}