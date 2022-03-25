import { getDocs, query, where } from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import pkg from 'lodash';
const { get } = pkg;

export default async function workerSearchByName(req, res) {
  const searchString = get(req, 'body.name', '').trim().toLowerCase();
  const q = query(workersCollectionRef, where("searchKeywords", "array-contains", searchString));

  await getDocs(q)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const workersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));

        analytics('WORKER_GET_BY_NAME_SUCCESS', {
          controller: 'workerControllerGetByName',
        });
        return res.status(200).json(message.success('Get workers by name. Success', workersList));
      } else {
        //
        const reason = 'Search workers by name. Fail. No such workers';
        analytics('WORKER_GET_BY_NAME_FAIL', {
          controller: 'workerControllerGetByName',
          reason: reason,
        });
        return res.status(400).json(message.fail(reason, true));
      }
    })
    .catch((error) => {
      analytics('WORKER_GET_BY_NAME_ERROR', {
        error: error.message,
        controller: 'workerControllerGetByName',
      });
      return res.status(400).json(message.fail('Get workers by name. Error', error));
    });
}
