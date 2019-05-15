#!/usr/bin/env node

import app from "./server"
import debug from "debug"
import http from "http"

const server = http.createServer(app);

const normalizePort = (value: string) => {
  const port = parseInt(value, 10);

  if (isNaN(port)) {
    // named pipe
    return value;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const onError = (error: any) => {
  console.log(error)
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const onListening = () => {
  const addr: any = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);