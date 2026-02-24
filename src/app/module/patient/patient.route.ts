import { Router } from "express";
import { PatientController } from "./patient.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { PatientValidation } from "./patient.validation";
import { multerUpload } from "../../../config/multer.config";
import { updateMyPatientProfileMiddleware} from "./patient.middleware";

const router = Router();

router.patch(
  "/update-my-profile",
  checkAuth(Role.PATIENT),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 },
  ]),
  updateMyPatientProfileMiddleware,
  validateRequest(PatientValidation.updatePatientProfileZodSchema),
  PatientController.updateMyProfile,
);

export const PatientRoutes = router;