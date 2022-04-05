import { addDoc } from "firebase/firestore";
import { statisticsCollectionRef } from "../../core/database.js";
import message from "../../utils/messages.js";

const statisticsCreateQuery = async (statisticsData) => {
  return await addDoc(statisticsCollectionRef, statisticsData)
    .then((statistics) => {
      return message.success('Statistics created successfully', statistics);
    })
    .catch((error) => {
      return message.fail('Creating statistics failed. Error', error);
    });
}

export default statisticsCreateQuery;

