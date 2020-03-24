const http = require("http");
const app = require("./app");

const server = http.createServer(app);
const config = require("./utils/config");
const PORT = config.PORT;

server.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});
