import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";

export default async function workerSetRegisterMode(req, res) {

  client.publish('registerMode/status', 'true',(error) => {
    if (!error) {
      //
      analytics('WORKER_SET_REGISTER_MODE_SUCCESS', {
        controller: 'workerControllerSetRegisterMode',
      });
      return res.status(200).json(message.success('Set worker register mode. Success', true));
    }
    else {
      //
      analytics('WORKER_SET_REGISTER_MODE_ERROR', {
        controller: 'workerControllerSetRegisterMode',
      });
      return res.status(400).json(message.fail('Set worker register mode. Error', error, true));
    }
  })
}
