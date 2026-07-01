import { Router } from "express";
import {
  bulkUpdatePlatformSettings,
  createPlatformSetting,
  deletePlatformSetting,
  getPlatformSetting,
  getPlatformSettings,
  updatePlatformSetting,
} from "../../../controllers/adminController/settings/admin.settings.controller.js";

const settingsRouter = Router();

settingsRouter.get("/", getPlatformSettings);
settingsRouter.get("/:key", getPlatformSetting);
settingsRouter.post("/", createPlatformSetting);
settingsRouter.patch("/:key", updatePlatformSetting);
settingsRouter.delete("/:key", deletePlatformSetting);
settingsRouter.post("/bulk", bulkUpdatePlatformSettings);

export default settingsRouter;