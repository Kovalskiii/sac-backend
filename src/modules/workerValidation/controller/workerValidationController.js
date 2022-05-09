import { client } from "../../core/mqtt.js";
import workerValidationQuery from "../queries/workerValidationQuery.js";

export default function workerValidationService() {
  client.on('message', function (topic, message) {
    //
    if (topic === 'workerValidation/rfid/setData') {
      workerValidationQuery(message.toString(), 'rfid').then();
    }
    else if (topic === 'workerValidation/fingerprint/setData') {
      workerValidationQuery(message.toString(), 'fingerprint').then();
    }
    else if (topic === 'workerValidation/camera/userfound') {
      workerValidationQuery(message.toString(), 'camera').then();
    }
  })
}






