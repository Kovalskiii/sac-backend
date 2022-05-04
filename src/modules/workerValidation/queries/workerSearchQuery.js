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
          return message.fail("No workers with such rfid. Fail", { rfid: data.trim() });
        }
      })
      .catch((error) => {
        return message.fail("No workers with such rfid. Error", { error: error, rfid: data.trim() });
      })
  }
  else if (type === 'fingerprint') {
    const q = query(workersCollectionRef, where("fingerprintId", "==", data.trim()));

    return await getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const worker = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
          return message.success('Worker found with such fingerprintId. Success', worker[0]);
        }
        else {
          return message.fail("No workers with such fingerprintId. Fail", { fingerprintId: data.trim() });
        }
      })
      .catch((error) => {
        return message.fail("No workers with such fingerprintId. Error", { error: error, fingerprintId: data.trim() });
      })
  }
  else if (type === 'camera')  {
    const workerDocRef = doc(db, 'workers', data.trim());

    return await getDoc(workerDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return message.success('Worker found with such id. Success', { id: workerDocRef.id, ...docSnapshot.data()});
        }
        else {
          return message.fail("No workers with such id. Fail", { workerId: data.trim() });
        }
      })
      .catch((error) => {
        return message.fail("No workers with such id. Error", { error: error, workerId: data.trim() });
      })
  }
}

export default workerSearchQuery;
