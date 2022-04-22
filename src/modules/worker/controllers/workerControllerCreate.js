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
  const rfid = get(req, 'body.rfid');
  const fingerprintId = get(req, 'body.fingerprintId');

  const newWorker = {
    firstName: firstName,
    lastName: lastName,
    name: `${firstName} ${lastName}`,
    photo: photo,
    rfid: rfid,
    fingerprintId: fingerprintId,
    searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
    timestamp: serverTimestamp(),
  };

  await addDoc(workersCollectionRef, newWorker)
    .then((worker) => {
      analytics('WORKER_CREATE_SUCCESS', {
        workerId: worker.id,
        controller: 'workerControllerCreate',
      });

      client.publish('registerMode', 'false', (error) => {
        if (error) {
          const reason = 'Cancel worker register mode. Fail';
          //
          analytics('WORKER_CREATE_FAIL', {
            error: error,
            reason: reason,
            controller: 'workerControllerCreate',
          });
          return message.fail(reason, error, true);
        }
      })

      client.publish('workerValidation/camera/getData', `please reload photos`,(error) => {
        if (error) {
          //
          analytics('WORKER_PUBLISH_MQTT_MESSAGE_ERROR', {
            controller: 'workerControllerCreate',
          });
          return message.fail('Publish mqtt message. Error', error, true);
        }
      })
      return res.status(200).json(message.success('Worker created successfully', worker.id));
      //
    })
    .catch((error) => {
      analytics('WORKER_CREATE_ERROR', {
        error: error.message,
        controller: 'workerControllerCreate',
      });
      return res.status(400).json(message.fail('Creating worker failed. Error', error));
    });
}
