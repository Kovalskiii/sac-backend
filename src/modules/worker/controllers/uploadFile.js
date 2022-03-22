import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { addDoc, serverTimestamp } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import uploadPhotoQuery from "../queries/uploadPhotoQuery.js";
const { get } = pkg;

export default async function uploadFile(req, res) {

  const file = req.file
  console.log(file)
  // const firstName = get(req, 'body.firstName');
  // const lastName = get(req, 'body.lastName');
  // const photo = get(req, 'body.photo');
  // //const rfid = get(req, 'body.rfid');
  // //const fingerprint = get(req, 'body.fingerprint');
  //
  // const newWorker = {
  //   firstName: firstName,
  //   lastName: lastName,
  //   name: `${firstName} ${lastName}`,
  //   photo: photo,
  //   //rfid: rfid,
  //   //fingerprint: fingerprint,
  //   timestamp: serverTimestamp(),
  // };

  // await addDoc(workersCollectionRef, newWorker)
  //   .then((worker) => {
  //     analytics('WORKER_CREATE_SUCCESS', {
  //       workerId: worker.id,
  //       controller: 'workerControllerCreate',
  //     });
  //     return res.status(200).json(message.success('Worker created successfully', worker.id));
  //
  //   })
  //   .catch((error) => {
  //     analytics('WORKER_CREATE_ERROR', {
  //       error: error.message,
  //       controller: 'workerControllerCreate',
  //     });
  //     res.status(400).json(message.fail('Creating worker failed. Error', error));
  //   });

  // await uploadPhotoQuery(file)
  //   .then((worker) => {
  //     analytics('PHOTO_UPLOADED_SUCCESS', {
  //       //workerId: worker.id,
  //       controller: 'workerControllerCreate',
  //     });
  //     return res.status(200).json(message.success('Photo uploaded successfully', worker));
  //
  //   })
  //   .catch((error) => {
  //     analytics('PHOTO_UPLOADED_ERROR', {
  //       error: error.message,
  //       controller: 'workerControllerCreate',
  //     });
  //     res.status(400).json(message.fail('Photo upload failed. Error', error));
  //   });
}
