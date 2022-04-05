import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";

export default async function workerGetFingerprintData(req, res) {
  let enterFlag = true;

  client.publish('registerMode/fingerprint/getData', 'give me fingerprint',(error) => {
    if (error) {
      //
      analytics('WORKER_GET_FINGERPRINT_DATA_ERROR', {
        controller: 'workerControllerGetFingerprintData',
      });
      return message.fail('Publish mqtt message. Error', error, true);
    }
  })

  client.on('message', function (topic, payload) {
    //
    if ((topic === 'registerMode/fingerprint/setData') && (enterFlag === true)) {
      enterFlag = false;
      //
      analytics('WORKER_GET_FINGERPRINT_DATA_SUCCESS', {
        controller: 'workerControllerGetFingerprintData',
      });
      return res.status(200).json(message.success('Get Fingerprint data. Success', payload.toString()));
    }
  })
}
