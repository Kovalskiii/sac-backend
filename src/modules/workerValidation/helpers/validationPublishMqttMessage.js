import { client } from "../../core/mqtt.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";

export function validationPublishMqttMessage(payload) {
  client.publish('workerValidation', `${payload}`,(error) => {
    if (error) {
      const reason = 'Mqtt publish message. Fail';
      //
      analytics('WORKER_VALIDATION_FAIL', {
        error: error,
        reason: reason,
        controller: 'validationPublishMqttMessage',
      });
      return message.fail(reason, error, true);
    }
  })
}
