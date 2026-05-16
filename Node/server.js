const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        return res.end("Welcome to My First Node.js Server");
    }

    else if (req.url === "/about") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        return res.end("About Page");
    }

    else if (req.url === "/contact") {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        return res.end("Contact Page");
    }

    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        return res.end("404 Page Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});