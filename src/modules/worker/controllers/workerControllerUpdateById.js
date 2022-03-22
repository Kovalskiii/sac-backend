import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../core/database.js";
const { get } = pkg;

export default async function workerUpdateById(req, res) {
  const workerId = get(req, 'params.workerId');
  const workerDocRef = doc(db, 'workers', workerId);
  const firstName = get(req, 'body.firstName');
  const lastName = get(req, 'body.lastName');
  const photo = get(req, 'body.photo');
  //const rfid = get(req, 'body.rfid');
  //const fingerprint = get(req, 'body.fingerprint');

  const updatedWorker = {
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    photo: photo,
    //rfid: rfid,
    //fingerprint: fingerprint,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(workerDocRef, updatedWorker)
    .then(() => {
      analytics('WORKER_UPDATE_BY_ID_SUCCESS', {
        workerId: workerDocRef.id,
        controller: 'workerControllerUpdateById',
      });
      return res.status(200).json(message.success('Worker updated successfully', workerDocRef.id));

    })
    .catch((error) => {
      analytics('WORKER_UPDATE_BY_ID_ERROR', {
        error: error.message,
        controller: 'workerControllerUpdateById',
      });
      res.status(400).json(message.fail('Worker update failed. Error', error));
    });
}
