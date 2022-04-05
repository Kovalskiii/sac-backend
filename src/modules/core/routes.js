import userRouter from '../user/userRoutes.js';
import workerRouter from '../worker/workerRoutes.js';
import statisticsRouter from "../statistics/statisticsRoutes.js";
import message from "../utils/messages.js";
import { client } from "./mqtt.js";
import { Router } from "express";

export default function routes(app) {
  app.use('/user', userRouter);
  app.use('/worker', workerRouter);
  app.use('/statistics', statisticsRouter);
  app.get('/socket', (req, res) => {
    res.render('socket');
  })
}
