/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";



// Create Specialty---------------------------------------------------------------------------------------------------

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await SpecialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed successful creation",
      data: error.message,
    });
  }
};


// Get all Specialties---------------------------------------------------------------------------------------------------
const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialties();

    res.status(200).json({
      success: true,
      message: "Specialties retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed To Retrieve Data",
      data: error.message,
    });
  }
};

// update Specialty---------------------------------------------------------------------------------------------------
const updateSpecialty = async (req: Request, res: Response) => {
    try {
        const specialtyId = req.params.id;
        const payload = req.body;
        const result = await SpecialtyService.updateSpecialty(specialtyId as string, payload);

        res.status(200).json({
            success: true,
            message: "Specialty updated successfully",
            data: result,
        });
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed To Update Specialty",
            data: error.message,
        });
    }
};

// Delete Specialty---------------------------------------------------------------------------------------------------
const deleteSpecialties = async (req: Request, res: Response) => {
    try {
        const specialtyId = req.params.id;
        const result = await SpecialtyService.deleteSpecialty(specialtyId as string);

        res.status(200).json({
            success: true,
            message: "Specialty deleted successfully",
            data: result,
        });
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed To Delete Specialty",
            data: error.message,
        });
    }
}

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialties
};
