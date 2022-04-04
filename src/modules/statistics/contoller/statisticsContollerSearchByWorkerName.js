import { getDocs, query, where } from "firebase/firestore";
import { statisticsCollectionRef } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import pkg from 'lodash';
const { get } = pkg;

export default async function statisticsSearchByWorkerName(req, res) {
  const searchString = get(req, 'body.name', '').trim().toLowerCase();
  const q = query(statisticsCollectionRef, where("searchKeywords", "array-contains", searchString));

  await getDocs(q)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const statisticsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));

        analytics('STATISTICS_GET_BY_WORKER_NAME_SUCCESS', {
          controller: 'statisticsControllerGetByWorkerName',
        });
        return res.status(200).json(message.success('Get statistics by worker name. Success', statisticsList));
      } else {
        //
        const reason = 'Search statistics by worker name. Fail. No such workers';
        analytics('STATISTICS_GET_BY_WORKER_NAME_FAIL', {
          controller: 'statisticsControllerGetByWorkerName',
          reason: reason,
        });
        return res.status(400).json(message.fail(reason, true));
      }
    })
    .catch((error) => {
      analytics('STATISTICS_GET_BY_WORKER_NAME_ERROR', {
        error: error.message,
        controller: 'statisticsControllerGetByWorkerName',
      });
      return res.status(400).json(message.fail('Get statistics by worker name. Error', error));
    });
}
