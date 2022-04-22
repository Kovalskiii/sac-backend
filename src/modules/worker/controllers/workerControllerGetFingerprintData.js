import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";
import generateUniqueFingerprintIdQuery from "../queries/generateUniqueFingerprintIdQuery.js";

export default async function workerGetFingerprintData(req, res) {
  let enterFlag = true;

  generateUniqueFingerprintIdQuery()
    .then((uniqueFingerprintId) => {
      //
      if (uniqueFingerprintId.success) {
        client.publish('registerMode/fingerprint/getData', `${uniqueFingerprintId.payload.fingerprintId}`,(error) => {
          if (error) {
            //
            analytics('WORKER_PUBLISH_MQTT_MESSAGE_ERROR', {
              controller: 'workerControllerGetFingerprintData',
            });
            return message.fail('Publish mqtt message. Error', error, true);
          }
        })

        client.on('message', function (topic, payload) {
          if ((topic === 'registerMode/fingerprint/setData') && (enterFlag === true)) {
            enterFlag = false;
            //
            analytics('WORKER_GET_FINGERPRINT_DATA_SUCCESS', {
              controller: 'workerControllerGetFingerprintData',
            });
            return res.status(200).json(message.success('Get Fingerprint data. Success', { fingerprintId: payload.toString() }));
          }
        })
      }
      else {
        const reason = uniqueFingerprintId.message;
        //
        analytics('GENERATE_UNIQUE_FINGERPRINT_ID_FAIL', {
          reason: reason,
          query: 'generateUniqueFingerprintIdQuery',
          controller: 'workerControllerGetFingerprintData',
        });
        return res.status(400).json(message.fail(reason, uniqueFingerprintId.payload, true));
      }
    })
    .catch((error) => {
      analytics('GENERATE_UNIQUE_FINGERPRINT_ID_ERROR', {
        error: error.message,
        query: 'generateUniqueFingerprintIdQuery',
        controller: 'workerControllerGetFingerprintData',
      });
      return res.status(400).json(message.fail('Generate unique fingerprint Id. Error', error));
    })
}
