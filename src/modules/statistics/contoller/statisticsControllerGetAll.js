import { getDocs, query } from "firebase/firestore";
import { statisticsCollectionRef } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";

export default async function statisticsGetAllList(req, res) {

  await getDocs(query(statisticsCollectionRef))
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const statisticsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));

        analytics('GET_ALL_STATISTICS_LIST_SUCCESS', {
          controller: 'statisticsControllerGetAll',
        });
        return res.status(200).json(message.success('Get all statistics list. Success', statisticsList));
      } else {
        //
        const reason = 'Get all statistics list. Fail. Statistics list is empty';
        analytics('GET_ALL_STATISTICS_LIST_FAIL', {
          controller: 'statisticsControllerGetAll',
          reason: reason,
        });
        return res.status(400).json(message.fail(reason, true));
      }
    })
    .catch((error) => {
      analytics('GET_ALL_STATISTICS_LIST_ERROR', {
        error: error.message,
        controller: 'statisticsControllerGetAll',
      });
      return res.status(400).json(message.fail('Get all statistics list. Error', error));
    });
}
