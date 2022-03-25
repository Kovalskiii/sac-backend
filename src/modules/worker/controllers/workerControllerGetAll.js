import { getDocs, query} from "firebase/firestore";
import { workersCollectionRef } from "../../core/database.js";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";

export default async function workerGetAllList(req, res) {

  await getDocs(query(workersCollectionRef))
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const workersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));

        analytics('GET_ALL_WORKERS_LIST_SUCCESS', {
          controller: 'workerControllerGetAll',
        });
        return res.status(200).json(message.success('Get all workers list. Success', workersList));

      } else {
        //
        const reason = 'Get all workers list. Fail. Workers list is empty';
        analytics('GET_ALL_WORKERS_LIST_FAIL', {
          controller: 'workerControllerGetAll',
          reason: reason,
        });
        return res.status(400).json(message.fail(reason, true));
      }
    })
    .catch((error) => {
      analytics('GET_ALL_WORKERS_LIST_ERROR', {
        error: error.message,
        controller: 'workerControllerGetAll',
      });
      return res.status(400).json(message.fail('Get all workers list. Error', error));
    });


}
