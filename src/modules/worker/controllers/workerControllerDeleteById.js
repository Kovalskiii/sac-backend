import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import pkg from 'lodash';
const { get } = pkg;

export default async function workerDeleteById(req, res) {
  const workerId = get(req, 'params.workerId');
  const workerDocRef = doc(db, 'workers', workerId);

  await getDoc(workerDocRef)
    .then((docSnapshot) => {
      if(docSnapshot.exists()) {
        //
        deleteDoc(workerDocRef)
          .then(() => {
            analytics('WORKER_DELETE_BY_ID_SUCCESS', {
              workerId: workerDocRef.id,
              controller: 'workerControllerDeleteById',
            });
            return res.status(200).json(message.success('Worker delete by id. Success', workerDocRef.id));

          })
          .catch((error) => {
            analytics('WORKER_DELETE_BY_ID_ERROR', {
              error: error.message,
              controller: 'workerControllerDeleteById',
            });
            res.status(400).json(message.fail('Worker delete by id failed. Error', error));
          });
      }
      else {
        const reason = 'No worker for provided id. Fail';
        //
        analytics('WORKER_DELETE_BY_ID_FAIL', {
          reason,
          workerId: workerDocRef.id,
          controller: 'workerControllerDeleteById',
        });
        res.status(400).json(message.fail(reason,true));
      }
    })
    .catch((error) => {
      analytics('WORKER_DELETE_BY_ID_ERROR', {
        error: error.message,
        controller: 'workerControllerDeleteById',
      });
      res.status(400).json(message.fail('No worker for provided id. Worker delete by id failed. Error', error));
    })
}




