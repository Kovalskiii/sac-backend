import { getDoc, doc } from "firebase/firestore";
import { db } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import pkg from 'lodash';
const { get } = pkg;

export default async function workerGetById(req, res) {
  const workerId = get(req, 'params.workerId');
  const workerDocRef = doc(db, 'workers', workerId);

  await getDoc(workerDocRef)
    .then((docSnapshot) => {
      if(docSnapshot.exists()) {
        //
        analytics('WORKER_GET_BY_ID_SUCCESS', {
          workerId: workerDocRef.id,
          controller: 'workerControllerGetById',
        });
        return res.status(200).json(message.success('Get worker by id. Success', docSnapshot.data()));
      }
      else {
        const reason = 'No worker for provided id. Fail';
        //
        analytics('WORKER_GET_BY_ID_FAIL', {
          reason,
          workerId: workerDocRef.id,
          controller: 'workerControllerGetById',
        });

        return res.status(400).json(message.fail(reason,true));
      }
    })
    .catch((error) => {
      analytics('WORKER_GET_BY_ID_ERROR', {
        error: error.message,
        controller: 'workerControllerGetById',
      });
      return res.status(400).json(message.fail('Get worker by id. Error', error));
    })
}
