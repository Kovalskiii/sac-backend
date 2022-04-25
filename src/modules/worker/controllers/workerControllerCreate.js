import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { addDoc, serverTimestamp } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import generateSearchKeywordsQuery from "../queries/generateSearchKeywordsQuery.js";
import uploadPhotoQuery from "../queries/uploadPhotoQuery.js";
const { get } = pkg;

export default async function workerCreate(req, res, next) {

  const photoFile = req.file;
  const firstName = get(req, 'body.firstName');
  const lastName = get(req, 'body.lastName');
  const rfid = get(req, 'body.rfid');
  const fingerprintId = get(req, 'body.fingerprintId');

  const newWorker = {
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    photo: 'null',
    rfid: rfid.toUpperCase().trim(),
    fingerprintId: fingerprintId,
    searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
    timestamp: serverTimestamp(),
  };

  const updatedWorker = { updatedAt: serverTimestamp() };
  const operationType = 'create';

  await addDoc(workersCollectionRef, newWorker)
    .then((worker) => {
      analytics('WORKER_CREATE_SUCCESS', {
        workerId: worker.id,
        controller: 'workerControllerCreate',
      });

      uploadPhotoQuery(photoFile, worker.id, res, updatedWorker, operationType);  //upload photo and after that, update worker fields
    })
    .catch((error) => {
      analytics('WORKER_CREATE_ERROR', {
        error: error.message,
        controller: 'workerControllerCreate',
      });
      return res.status(400).json(message.fail('Creating worker failed. Error', error));
    });
}
