require("dotenv").config();

const express =
    require("express");

const mongoose =
    require("mongoose");

const cors =
    require("cors");

const Task =
    require("./models/Task");

const app =
    express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(
    process.env.MONGO_URI
)

    .then(() =>
        console.log(
            "MongoDB Connected"
        ))

    .catch(err =>
        console.log(err));



// ---------- GET ALL TASKS ----------

app.get(
    "/tasks",
    async (req, res) => {

        try {

            const tasks =
                await Task.find()
                    .sort({
                        createdAt: -1
                    });

            res.json(tasks);

        } catch (error) {

            res.status(500).json({
                message:
                    error.message
            });
        }
    });



// ---------- ADD TASK ----------

app.post(
    "/tasks",
    async (req, res) => {

        try {

            const task =
                new Task({
                    title:
                        req.body.title,

                    category:
                        req.body.category
                });

            await task.save();

            res.status(201)
                .json(task);

        } catch (error) {

            res.status(500)
                .json({
                    message:
                        error.message
                });
        }
    });



// ---------- UPDATE TASK ----------

app.put(
    "/tasks/:id",
    async (req, res) => {

        try {

            const updatedTask =
                await Task.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        returnDocument: "after"
                    }
                );

            res.json(
                updatedTask
            );

        } catch (error) {

            res.status(500)
                .json({
                    message:
                        error.message
                });
        }
    });



// ---------- DELETE TASK ----------

app.delete(
    "/tasks/:id",
    async (req, res) => {

        try {

            await Task
                .findByIdAndDelete(
                    req.params.id
                );

            res.json({
                message:
                    "Task Deleted"
            });

        } catch (error) {

            res.status(500)
                .json({
                    message:
                        error.message
                });
        }
    });



const PORT =
    process.env.PORT
    || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server Running on Port ${PORT}`
        );

    });