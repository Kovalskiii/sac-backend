import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, workersCollectionRef } from "../../core/database.js";
import message from "../../utils/messages.js";

const workerSearchQuery = async (data, type) => {
  //
  if (type === 'rfid') {
    const q = query(workersCollectionRef, where("rfid", "==", data.toUpperCase().trim()));
    //
    return await getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const worker = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
          return message.success('Worker found with such rfid. Success', worker[0]);
        }
        else {
          return message.fail("No workers with such rfid. Fail", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such rfid. Error", error);
      })
  }
  else if (type === 'fingerprint') {
    const q = query(workersCollectionRef, where("fingerprint", "==", data));

    return await getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const worker = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
          return message.success('Worker found with such fingerprint. Success', worker[0]);
        }
        else {
          return message.fail("No workers with such fingerprint. Fail", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such fingerprint. Error", error);
      })
  }
  else if (type === 'camera')  {
    const workerDocRef = doc(db, 'workers', data);

    return await getDoc(workerDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return message.success('Worker found with such id. Success', { id: workerDocRef.id, ...docSnapshot.data()});
        }
        else {
          return message.fail("No workers with such id. Fail", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such id. Error", error);
      })
  }
}

export default workerSearchQuery;
