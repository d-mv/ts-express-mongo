export const showRequest = (headers: any, params: any) => {
  console.log("");
  console.log("\x1b[34m", "§ Router - Incoming request:");
  console.log(headers);
  console.log(params);
  console.log("");
}