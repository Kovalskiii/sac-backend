import message from '../../utils/messages.js';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../core/database.js"

const userUpdateByIdQuery = async ({userId, values }) => {
  const userDocRef = doc(db, "users", userId);

  return await updateDoc(userDocRef, {
    values: values,
  }).then(() => {
    return message.success('Success. User updated');
  }).catch((error) => {
    return message.fail('Error. User update error', error);
  })
};

export default userUpdateByIdQuery;
