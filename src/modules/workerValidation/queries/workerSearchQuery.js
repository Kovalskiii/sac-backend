import { getDocs, query, where } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import message from "../../utils/messages.js";


const workerSearchQuery = async (data) => {

  if (data.rfid !== null) {
    //const q = query(workersCollectionRef, where("searchKeywords", "array-contains", searchString));

    const q = query(workersCollectionRef, where("rfid", "==", data.rfid));

    await getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((worker) => {
            return worker;
          })
        }
        else {
          return message.fail("No workers with such rfid", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such rfid. Error", error);
      })
  }
  else if (data.fprint !== null) {
    const q = query(workersCollectionRef, where("fingerprint", "==", data.fprint));

    await getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((worker) => {
            return worker;
          })
        }
        else {
          return message.fail("No workers with such rfid", true);
        }
      })
      .catch((error) => {
        return message.fail("No workers with such rfid. Error", error);
      })
  }
  else {

  }


}

export default workerSearchQuery;
