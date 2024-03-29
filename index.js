const { default: axios } = require("axios");
const Redis = require("ioredis");
const redis = new Redis();
const app = require("express")()

app.get("/get-todos", async (req, res) => {
    try {
        const cachedData = await redis.get("get-todos")

        if (cachedData) {
            res.send(JSON.parse(cachedData))
        } else {
            await axios.get("https://jsonplaceholder.typicode.com/todos").then(async (response) => {
                res.send(response.data)
                await redis.set("get-todos", JSON.stringify(response.data))
            }).catch((err) => {
                res.send(err)
            })
        }

    } catch (error) {
        res.send(error)
    }
})

app.listen("5000", () => {
    console.log("Server started on port 5000");
})