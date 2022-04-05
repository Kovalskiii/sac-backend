import workerSearchQuery from "./workerSearchQuery.js";
import { serverTimestamp } from "firebase/firestore";
import analytics from "../../analytics/controllers/analytics.js";
import message from "../../utils/messages.js";
import statisticsCreateQuery from "../../statistics/queries/statisticsCreateQuery.js";
import { validationPublishMqttMessage } from "../helpers/validationPublishMqttMessage.js";

const workerValidationQuery = async (data, type) => {

  const worker = await workerSearchQuery(data, type);

  if (worker.success) {
    //
    const statisticsData = {
      workerId: worker.payload.id,
      name: worker.payload.name,
      photo: worker.payload.photo,
      searchKeywords: worker.payload.searchKeywords,
      //searchKeywords: await generateSearchKeywordsQuery(firstName, lastName),
      timestamp: serverTimestamp(),
    };

    analytics('WORKER_VALIDATION_SUCCESS', {
      controller: 'workerValidationQuery',
      worker: worker.payload.name,
    });
    message.success('Worker validation. Success', worker.payload.id);

    const statistics = await statisticsCreateQuery(statisticsData);

    if (statistics.success) {
      //
      validationPublishMqttMessage('true');

      analytics('STATISTICS_CREATION_SUCCESS', {
        controller: 'workerValidationQuery',
        worker: worker.payload.name,
      });
      return message.success('Statistics created. Success', statistics.payload.id);
    }
    else {
      const reason = 'Creating statistics failed. Error';
      //
      analytics('STATISTICS_CREATION_ERROR', {
        reason: reason,
        error: statistics.message,
        controller: 'workerValidationQuery',
      });
      return message.fail(reason, true);
    }
  }
  else {
    const reason = 'Worker validation failed. Error';
    //
    analytics('WORKER_VALIDATION_ERROR', {
      error: worker.message,
      reason: reason,
      controller: 'workerValidationQuery',
    });

    validationPublishMqttMessage('false');

    return message.fail(reason, true);
  }
}

export default workerValidationQuery;



