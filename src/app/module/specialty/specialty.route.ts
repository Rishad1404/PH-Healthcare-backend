/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();

router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),SpecialtyController.createSpecialty);
router.patch('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),SpecialtyController.updateSpecialty);
router.get('/',checkAuth(Role.PATIENT),SpecialtyController.getAllSpecialties);
router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),SpecialtyController.deleteSpecialties);

export const SpecialtyRoutes=router