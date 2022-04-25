import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../core/database.js";
import pkg from 'lodash';
import generateSearchKeywordsQuery from "../queries/generateSearchKeywordsQuery.js";
import uploadPhotoQuery from "../queries/uploadPhotoQuery.js";
const { get } = pkg;

export default async function workerUpdateById(req, res) {
  const photoFile = req.file;
  const workerId = get(req, 'params.workerId');
  const workerDocRef = doc(db, 'workers', workerId);
  const firstName = get(req, 'body.firstName');
  const lastName = get(req, 'body.lastName');
  const rfid = get(req, 'body.rfid');
  const fingerprintId = get(req, 'body.fingerprintId');
  const operationType = 'update';

  const updatedWorker = {
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    rfid: rfid.toUpperCase().trim(),
    fingerprintId: fingerprintId,
    searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
    updatedAt: serverTimestamp(),
  };

  await getDoc(workerDocRef)
    .then((docSnapshot) => {
      if(docSnapshot.exists()) {
        //
        uploadPhotoQuery(photoFile, workerId, res, updatedWorker, operationType);  //upload photo and after that, update worker fields
      }
      else {
        const reason = 'No worker for provided id. Fail';
        //
        analytics('WORKER_UPDATE_BY_ID_FAIL', {
          reason,
          workerId: workerDocRef.id,
          controller: 'workerControllerUpdateById',
        });
        res.status(400).json(message.fail(reason,true));
      }
    })
    .catch((error) => {
      analytics('WORKER_UPDATE_BY_ID_ERROR', {
        error: error.message,
        controller: 'workerControllerUpdateById',
      });
      res.status(400).json(message.fail('No worker for provided id. Worker update by id failed. Error', error));
    })
}
