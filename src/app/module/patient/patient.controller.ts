import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PatientService } from "./patient.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";

const updateMyProfile=catchAsync(async(req:Request,res:Response)=>{
    const user = req.user;
    const payload=req.body;

    const patient = await PatientService.updateMyProfile(user,payload);
    sendResponse(res,{
        success: true,
        httpStatusCode:status.OK,
        message: "Patient updated successfully",
        data: patient,
    })
})




export const PatientController={
    updateMyProfile
}