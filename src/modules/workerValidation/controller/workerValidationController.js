import { serverTimestamp } from "firebase/firestore";
import statisticsCreateQuery from "../../statistics/queries/statisticsCreateQuery.js";
import workerSearchQuery from "../queries/workerSearchQuery.js";
import message from "../../utils/messages";

// const data = {
//   rfid : null,
//   fingerprint : null,
// }

export default async function workerValidation(data) {

  await workerSearchQuery(data)
    .then((worker) => {
      if (worker.success) {
        //
        const statisticsData = {
          workerId: worker.id,
          firstName: worker.data().firstName,
          lastName: worker.data().lastName,
          name: worker.data().name,
          photo: worker.data().photo,
          searchKeywords: worker.data().searchKeywords,
          //searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
          timestamp: serverTimestamp(),
        };

        statisticsCreateQuery(statisticsData)
          .then((statistics) => {
            if (statistics.success) {
              return true;
            }
            else {
              return false;
            }
          })
          .catch((error) => {
            return message.fail('Creating statistics failed. Error', error);
          })
      }
      else {
        return false;
      }
    })
    .catch((error) => {
      return message.fail("Worker validation failed. Error", error);
    })
}



