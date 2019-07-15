const Express = require("express");
const server = Express();

let port = 3000;

server.post("/login", (req, res) => {
    res.send("hello");
});

server.listen(port, () => {
    console.log("Server listening on localhost:" + port);
});
