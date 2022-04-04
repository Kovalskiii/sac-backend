import { Router } from 'express';
import serviceHeader from "../utils/serviceHeader.js";
import userCheckAuth from "../user/middlewares/userCheckAuth.js";
import userCheckPerm from "../permission/userCheckPerm.js";
import statisticsGetAllList from "./contoller/statisticsControllerGetAll.js";
import statisticsSearchByWorkerName from "./contoller/statisticsContollerSearchByWorkerName.js";

const router = Router();

router.get(
  '/getAll',
  serviceHeader('jobProposalGetAll'),
  userCheckAuth,
  userCheckPerm('admin.statistics.all'),
  statisticsGetAllList,
);

router.post(
  '/searchByWorkerName',
  serviceHeader('statisticsControllerSearchByWorkerName'),
  userCheckAuth,
  userCheckPerm('admin.statistics.all'),
  statisticsSearchByWorkerName,
);

export default router;
