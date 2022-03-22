import userRouter from '../user/userRoutes.js';
import workerRouter from '../worker/workerRoutes.js';

export default function routes(app) {
  app.use('/user', userRouter);
  app.use('/worker', workerRouter);
  app.get('/socket', (req, res) => {
    res.render('socket');
  })
}
