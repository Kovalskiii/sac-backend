import { updateDoc } from "firebase/firestore";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";

const workerUpdateByIdQuery = async (workerDocRef, updatedWorkerObj, res, operationType) => {
  //
  return updateDoc(workerDocRef, updatedWorkerObj)
    .then(() => {
      analytics('WORKER_UPDATE_BY_ID_SUCCESS', {
        workerId: workerDocRef.id,
        query: 'workerUpdateByIdQuery',
      });

      if (operationType === 'create') {
        res.status(200).json(message.success('Worker is created. Success', { workerId: workerDocRef.id }));
      }
      else if (operationType === 'update') {
        res.status(200).json(message.success('Worker update by id. Success', { workerId: workerDocRef.id }));
      }

      client.publish('registerMode/status', 'false', (error) => {
        if (error) {
          const reason = 'Cancel worker register mode. Fail';
          //
          analytics('PUBLISH_MQTT_MESSAGE_FAIL', {
            error: error.message,
            reason: reason,
            query: 'workerUpdateByIdQuery',
          });
          return message.fail(reason, error, true);
        }
      })

      client.publish('workerValidation/camera/databaseupdate', 'please reload photos',(error) => {
        if (error) {
          const reason = 'Publish mqtt message. Error';
          //
          analytics('PUBLISH_MQTT_MESSAGE_ERROR', {
            error: error.message,
            reason: reason,
            query: 'workerUpdateByIdQuery',
          });
          return message.fail(reason, error, true);
        }
      })
    })
    .catch((error) => {
      analytics('WORKER_UPDATE_BY_ID_ERROR', {
        error: error.message,
        query: 'workerUpdateByIdQuery',
      });
      return res.status(400).json(message.fail('Worker update by id failed. Error', error));
    });
}

export default workerUpdateByIdQuery;

