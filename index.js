// code away!
const express = require("express");

const userRoutes = require("./users/userRouter");
const postRoutes = require("./posts/postRouter");

const server = require("./server");

server.use(express.json());

const port = 3000;

server.use("/users", userRoutes);
server.use("/posts", postRoutes);

server.listen(port, () => console.log(`Server running on port ${port}`));
