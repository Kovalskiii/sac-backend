import { getDocs, query, where } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import message from "../../utils/messages.js";

const workerSearchQuery = async (data, type) => {

  if (type === 'rfid') {
    //const q = query(workersCollectionRef, where("searchKeywords", "array-contains", searchString));
    const q = query(workersCollectionRef, where("rfid", "==", data));

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
          return message.fail("No workers with such rfid. Fail", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such rfid. Error", error);
      })
  }
  else {
    //TODO /* call opencv query*/
    return message.fail("No workers with such photo. Fail", true);
  }
}

export default workerSearchQuery;
