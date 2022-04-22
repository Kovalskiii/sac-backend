import { getDocs, query } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import message from "../../utils/messages.js";

const generateUniqueFingerprintIdQuery = async () => {
  let fingerprintId = 0;

  return await getDocs(query(workersCollectionRef))
    .then((querySnapshot) => {
      //
      if (!querySnapshot.empty) {
        const workersFPrintIdList = querySnapshot.docs.map((doc) => (+doc.data().fingerprintId));
        //
        const maxWorkersNum = 126;
        if (workersFPrintIdList.length !== maxWorkersNum) {
          //
          let filledWorkersFPrintIdList = Array.from(Array(maxWorkersNum), () => 0);
          workersFPrintIdList.forEach((e) => (filledWorkersFPrintIdList[e - 1] = 1));
          fingerprintId = filledWorkersFPrintIdList.indexOf(0) + 1;

          return message.success('Finger Print Id generated successfully', { fingerprintId: fingerprintId })
        }
        else {
          fingerprintId = null;
          return message.fail(`The list of workers is full, ${maxWorkersNum} values are filled. Fingerprint id can not be generated. Fail`, { fingerprintId: fingerprintId });
        }
      } else {
        //
        fingerprintId = 1;
        return message.success('The list of workers is empty.', { fingerprintId: fingerprintId })
      }
    })
    .catch((error) => {
      return message.fail('Generate unique fingerprint Id. Error', error);
    });
}

export default generateUniqueFingerprintIdQuery;
