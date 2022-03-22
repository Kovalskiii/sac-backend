import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import message from "../../utils/messages.js";
import { storage } from "../../core/database.js";

const uploadPhotoQuery = async ({file}) => {
  const metadata = {
    contentType: 'image/jpeg',
  };
  const storageRef = ref(storage, 'workersPhoto/' + file.filename);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  await uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      return message.fail('Photo upload. Error', error.code);
    },
    () => {
      return getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        return downloadURL;
      });
    }
  );


//   return await updateDoc(userDocRef, {
//     values: values,
//   }).then(() => {
//     return message.success('Success. User updated');
//   }).catch((error) => {
//     return message.fail('Error. User update error', error);
//   })
// };
};
export default uploadPhotoQuery;
