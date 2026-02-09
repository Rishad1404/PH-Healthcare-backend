import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router=Router();

router.post('/',SpecialtyController.createSpecialty);
router.patch('/:id',SpecialtyController.updateSpecialty);
router.get('/',SpecialtyController.getAllSpecialties);
router.delete('/:id',SpecialtyController.deleteSpecialties);

export const SpecialtyRoutes=router