import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import pkg from 'lodash';
import { client } from "../../core/mqtt.js";
import { ref, deleteObject } from "firebase/storage";
const { get } = pkg;

export default async function workerDeleteById(req, res) {
  const workerId = get(req, 'params.workerId');
  const workerDocRef = doc(db, 'workers', workerId);
  const photoRef = ref(storage, `${workerId}`);

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

            deleteObject(photoRef)
              .then(() => {
                analytics('WORKER_PHOTO_DELETE_SUCCESS', {
                  workerId: workerDocRef.id,
                  controller: 'workerControllerDeleteById',
                });
                res.status(200).json(message.success('Worker photo and worker delete by id. Success', workerDocRef.id));
              })
              .catch((error) => {
                analytics('WORKER_PHOTO_DELETE_ERROR', {
                  error: error.message,
                  reason: 'Worker photo is not deleted',
                  controller: 'workerControllerDeleteById',
                });
              })

            client.publish('workerValidation/camera/databaseupdate', `please reload photos`,(error) => {
              if (error) {
                //
                analytics('WORKER_PUBLISH_MQTT_MESSAGE_ERROR', {
                  controller: 'workerControllerDeleteById',
                });
                return message.fail('Publish mqtt message. Error', error, true);
              }
            })
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




