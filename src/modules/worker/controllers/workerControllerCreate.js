import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { addDoc, serverTimestamp } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import generateSearchKeywordsQuery from "../queries/generateSearchKeywordsQuery.js";
import { client } from "../../core/mqtt.js";
const { get } = pkg;

export default async function workerCreate(req, res) {

  const firstName = get(req, 'body.firstName');
  const lastName = get(req, 'body.lastName');
  const photo = get(req, 'body.photo');
  //const rfid = get(req, 'body.rfid');
  //const fingerprint = get(req, 'body.fingerprint');

  const newWorker = {
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    photo: photo,
    //rfid: rfid,
    //fingerprint: fingerprint,
    searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
    timestamp: serverTimestamp(),
  };

  await addDoc(workersCollectionRef, newWorker)
    .then((worker) => {
      analytics('WORKER_CREATE_SUCCESS', {
        workerId: worker.id,
        controller: 'workerControllerCreate',
      });

      client.publish('registerMode', `false`,(error) => {
        if (error) {
          return console.log(message.fail('Cancel worker register mode. Error', error, true));
        }
      })
      return res.status(200).json(message.success('Worker created successfully', worker.id));

    })
    .catch((error) => {
      analytics('WORKER_CREATE_ERROR', {
        error: error.message,
        controller: 'workerControllerCreate',
      });
      res.status(400).json(message.fail('Creating worker failed. Error', error));
    });
}
