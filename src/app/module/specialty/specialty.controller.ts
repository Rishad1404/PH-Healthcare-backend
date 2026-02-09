/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

// Create Specialty---------------------------------------------------------------------------------------------------

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await SpecialtyService.createSpecialty(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty created successfully",
    data: result,
  });
});

// Get all Specialties-------------------------------------------------------------------------------------------------
const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtyService.getAllSpecialties();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

// update Specialty---------------------------------------------------------------------------------------------------
const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const specialtyId = req.params.id;
  const payload = req.body;
  const result = await SpecialtyService.updateSpecialty(
    specialtyId as string,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty updated successfully",
    data: result,
  });
});

// Delete Specialty---------------------------------------------------------------------------------------------------
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const specialtyId = req.params.id;
  const result = await SpecialtyService.deleteSpecialty(specialtyId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialties,
};
