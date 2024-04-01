const axios = require("axios").default;
const http = require("http");
const Redis = require("ioredis");
const redis = new Redis();

const server = http.createServer(async (req, res) => {
    console.log("req.method", req.method);
    console.log("req.url", req.url);
    if (req.method === 'GET' && req.url === '/get-todos') {
        try {
            const cachedData = await redis.get("get-todos");

            if (cachedData) {
                console.log(JSON.parse(cachedData));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(cachedData);
            } else {
                const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
                const todosData = JSON.stringify(response.data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(todosData);
                await redis.set("get-todos", todosData, "EX", 60);
            }

        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(error.message);
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
