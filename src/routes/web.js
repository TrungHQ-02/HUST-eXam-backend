import express from "express";

let router = express.Router();

let initRoutes = (app) => {
   return app.use("/", router);
}

module.exports = initRoutes;