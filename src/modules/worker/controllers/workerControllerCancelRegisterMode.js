import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import { client } from "../../core/mqtt.js";

export default async function workerCancelRegisterMode(req, res) {

  client.publish('registerMode', `false`,(error) => {
    if (!error) {
      //
      analytics('WORKER_CANCEL_REGISTER_MODE_SUCCESS', {
        controller: 'workerControllerCancelRegisterMode',
      });
      return res.status(200).json(message.success('Cancel worker register mode. Success', true));
    }
    else {
      //
      analytics('WORKER_CANCEL_REGISTER_MODE_ERROR', {
        controller: 'workerControllerCancelRegisterMode',
      });
      return res.status(400).json(message.fail('Cancel worker register mode. Error', error, true));
    }
  })
}

