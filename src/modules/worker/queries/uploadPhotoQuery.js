import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import message from "../../utils/messages.js";
import { db, storage } from "../../core/database.js";
import { doc } from "firebase/firestore";
import analytics from "../../analytics/controllers/analytics.js";
import workerUpdateByIdQuery from "./workerUpdateByIdQuery.js";

const uploadPhotoQuery = async (photoFile, workerId, res, updatedWorkerObj, operationType) => {
  const workerDocRef = doc(db, 'workers', workerId);

  if (photoFile) {
    const fileExtension = photoFile.mimetype.split('/').pop();
    const photoName = workerId + "." + fileExtension;
    const metadata = { contentType: photoFile.mimetype };
    const storageRef = ref(storage, `${photoName}`);
    const uploadTask = uploadBytesResumable(storageRef, photoFile.buffer, metadata);
    console.log(photoFile)

    await uploadTask.on('state_changed',
      (snapshot) => {},
      (error) => {
        const reason = 'Photo upload to the firebase storage failed. Error';
        //
        analytics('PHOTO_UPLOAD_ERROR', {
          error: error.code,
          reason: reason,
          query: 'uploadPhotoQuery',
        });
        message.fail(reason, error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            //
            updatedWorkerObj.photo = downloadURL;
            workerUpdateByIdQuery(workerDocRef, updatedWorkerObj, res, operationType);  //update worker fields
          })
          .catch(error => {
            const reason = 'Get photo download url failed. Error';
            //
            analytics('GET_PHOTO_URL_ERROR', {
              error: error,
              reason: reason,
              query: 'uploadPhotoQuery',
            });
            message.fail(reason, error);
          });
      }
    );
  }
  else {
    await workerUpdateByIdQuery(workerDocRef, updatedWorkerObj, res, operationType);  //update worker fields
  }
};
export default uploadPhotoQuery;
