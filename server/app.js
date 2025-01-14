import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import pingRouter from "./routes/ping";
import userRouter from "./routes/user";
import projectRouter from "./routes/project";
import profileRouter from "./routes/profile";
import investmentRouter from "./routes/investment";

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// start up mongoose db
require("./database/mongoose");

app.use("/ping", pingRouter);
app.use(userRouter);
app.use(projectRouter);
app.use(profileRouter);
app.use(investmentRouter);

app.use(express.static(join(__dirname, "public", "build")));
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "public", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
