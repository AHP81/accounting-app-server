import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.json({
        status: "ok",
        message: "Exchange API Running",
    });
});

app.listen(3000, () => {
    console.log("Server Running :3000");
});