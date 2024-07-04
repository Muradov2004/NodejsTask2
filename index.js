const http = require("http");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const encrypt = require("./encrypt");
const fs = require("fs");

emitter.on("logError", (message) => {
  const errorMessage = `error: ${message} => time: ${new Date().toISOString()}\n`;
  fs.appendFileSync("errors.txt", errorMessage);
});

emitter.on("encryptString", async (data) => {
  try {
    const value = await encrypt.encryptString(data.password);
    console.log(value);
  } catch (error) {
    emitter.emit("logError", error.message);
  }
});

emitter.on("compareString", async (data) => {
  try {
    const { originalPassword, hashPassword } = data;
    const value = await encrypt.compareString(originalPassword, hashPassword);
    console.log(value);
  } catch (error) {
    emitter.emit("logError", error.message);
  }
});

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/encrypt") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const stringToEncrypt = JSON.parse(body);
      emitter.emit("encryptString", stringToEncrypt);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success" }));
    });
  } else if (req.method === "POST" && req.url === "/compare") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      emitter.emit("compareString", data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success" }));
    });
  } else {
    emitter.emit("logError", "wrong endpoint");
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(5000, () => {
  console.log("server started at 5000");
});
