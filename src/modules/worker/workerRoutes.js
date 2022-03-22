import { Router } from 'express';
import serviceHeader from "../utils/serviceHeader.js";
import userCheckAuth from "../user/middlewares/userCheckAuth.js";
import userCheckPerm from "../permission/userCheckPerm.js";
import workerCreate from "./controllers/workerControllerCreate.js";
import workerDeleteById from "./controllers/workerControllerDeleteById.js";
import workerGetAllList from "./controllers/workerControllerGetAll.js";
import workerGetById from "./controllers/workerControllerGetById.js";
import workerSearchByName from "./controllers/workerControllerSearchByName.js";
import workerUpdateById from "./controllers/workerControllerUpdateById.js";
import uploadFile from "./controllers/uploadFile.js";
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

const router = Router();

router.post(
  '/create',
  serviceHeader('workerControllerCreate'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerCreate,
);

router.delete(
  '/delete/:workerId',
  serviceHeader('jobProposalDeleteById'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerDeleteById,
);

router.get(
  '/getAll',
  serviceHeader('jobProposalGetAll'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerGetAllList,
);

router.get(
  '/get/:workerId',
  serviceHeader('workerControllerGetById'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerGetById,
);

router.post(
  '/searchByName',
  serviceHeader('workerControllerSearchByName'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerSearchByName,
);

router.patch(
  '/update/:workerId',
  serviceHeader('workerControllerUpdateById'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  workerUpdateById,
);

router.post(
  '/upload',
  serviceHeader('workerControllerCreate'),
  userCheckAuth,
  userCheckPerm('admin.worker.all'),
  upload.single('photo'),
  uploadFile,
);

export default router;
