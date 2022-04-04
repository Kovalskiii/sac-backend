import express from 'express';
import logger from './modules/core/logger.js';
import parseResponse from './modules/core/parseResponse.js';
import cors from './modules/core/cors.js';
import chai from 'chai';
import serverStart from './modules/core/serverStart.js';
import routes from './modules/core/routes.js';
import errorHandling from './modules/core/errorHandling.js';
import chai_datetime from 'chai-datetime';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import { mqttConnection } from "./modules/core/mqtt.js";

dotenv.config({ path: './.env' });

chai.use(chai_datetime);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
  console.log('User connected:' + socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

app.disable('x-powered-by'); // Disable Express signature
logger(app);
parseResponse(app);
cors(app);
routes(app);
errorHandling(app);
app.set('view engine', 'ejs');
mqttConnection();
serverStart(httpServer);

export default app;







// app.disable('x-powered-by'); // Disable Express signature
// logger(app);
// parseResponse(app);
// cors(app);
// routes(app);
// errorHandling(app);
//
// const server = serverStart(app);
//
// export default app;

