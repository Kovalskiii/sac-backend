import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";

export default async function workerGetRfidData(req, res) {
  let enterFlag = true;

  client.publish('registerMode/rfid/getData', 'give me rfid',(error) => {
    if (error) {
      //
      analytics('WORKER_GET_RFID_DATA_ERROR', {
        controller: 'workerControllerGetRfidData',
      });
      return message.fail('Publish mqtt message. Error', error, true);
    }
  })

  client.on('message', function (topic, payload) {
    //
    if ((topic === 'registerMode/rfid/setData') && (enterFlag === true)) {
      enterFlag = false;
      //
      analytics('WORKER_GET_RFID_DATA_SUCCESS', {
        controller: 'workerControllerGetRfidData',
      });
      return res.status(200).json(message.success('Get RFID data. Success', payload.toString()));
    }
  })
}
