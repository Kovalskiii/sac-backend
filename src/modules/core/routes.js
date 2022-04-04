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

  app.get('/mqtt', (req, res) => {
    client.publish('testing', 'Hello mqtt',(error) => {
      if (error) {
        console.error(error)
      }
      else {
        console.log('Message is published')
      }
    })
    return res.status(200).json(message.success("message send", true));
  })

  // app.use('/mqtt', Router().get("" ,(req, res) => {
  //   client.on('connect', () => {
  //     console.log('Connected')
  //     client.publish('test', 'Hello mqtt',(error) => {
  //       if (error) {
  //         console.error(error)
  //       }
  //     })
  //   })
  //   return res.status(200).json(message.success("message send", true));
  // })
  // )


}
