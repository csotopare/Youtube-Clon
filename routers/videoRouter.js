import express from 'express';

import {
   deleteVideo,
   getEditVideo,
   getUpload,
   postEditVideo,
   postUpload,
   videoDetail,
} from '../controllers/videoController';
import { onlyPrivate, uploadVideo } from '../middlewares';
import routes from '../routes';

const videoRouter = express.Router();

// Upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

// Video Detail
videoRouter.get(routes.videoDetail(), videoDetail);

// Video Edit
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

// Video Delete
videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;
