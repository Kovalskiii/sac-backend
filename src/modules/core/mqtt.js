import * as mqtt from "mqtt"
import workerValidationService from "../workerValidation/controller/workerValidationController.js";

export const client = mqtt.connect({ port: 8883, host: '78.47.52.122', keepalive: 10000});
//export const client = mqtt.connect({ port: 1883, host: 'broker.emqx.io', keepalive: 10000});

export function mqttConnection() {
  client.on('connect', function () {
    mqttSubscribe();
    console.log('mqtt client connected')
  })

  client.on('reconnect', function () {
    console.log('mqtt client reconnecting...')
  })

  client.on('error', function (error) {
    console.log('mqtt error', error);
    client.end()
    client.reconnect();
  })

  workerValidationService();
}

function mqttSubscribe() {
  client.subscribe({
    'registerMode': { qos: 2 },
    'registerMode/rfid/setData': { qos: 2 },
    'registerMode/fingerprint/setData': { qos: 2 },
    'workerValidation/rfid/setData': { qos: 2 },
    'workerValidation/fingerprint/setData': { qos: 2 },
    'workerValidation/camera/setData': { qos: 2 }
  }, function (err) {
    if (err) {
      console.log('Subscribe to the topic error', err);
    }
  })
}
