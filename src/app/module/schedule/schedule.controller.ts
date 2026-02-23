import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";

const createSchedule=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body;
    const result=await ScheduleService.createSchedule(payload);
    sendResponse(res,{
        httpStatusCode:status.CREATED,
        success: true,
        message: "Schedule created successfully",
        data:result
    })
})

const getAllSchedules=catchAsync(async(req:Request,res:Response)=>{
    const query=req.query;
    const getAllSchedules=await ScheduleService.getAllSchedules(query as IQueryParams);
    sendResponse(res,{
        httpStatusCode:status.OK,
        success: true,
        message: "Schedules retrieved successfully",
        data: getAllSchedules
    })
})

const getScheduleById=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const getScheduleById=await ScheduleService.getScheduleById(id as string);
    sendResponse(res,{
        httpStatusCode:status.OK,
        success: true,
        message: "Schedule retrieved successfully",
        data: getScheduleById
    })
})

const updateSchedule=catchAsync(async(req:Request,res:Response)=>{

    const {id}=req.params;
    const payload=req.body;
    const updatedSchedule=await ScheduleService.updateSchedule(id as string,payload);
    sendResponse(res,{
        httpStatusCode:status.OK,
        success: true,
        message: "Schedule updated successfully",
        data: updatedSchedule
    })
})

const deleteSchedule=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    await ScheduleService.deleteSchedule(id as string);
    sendResponse(res,{
        httpStatusCode:status.OK,
        success: true,
        message: "Schedule deleted successfully",
    })
})

export const ScheduleController={
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}