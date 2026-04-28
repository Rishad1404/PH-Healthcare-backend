import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { RAGService } from "./rag.service";

const ragService = new RAGService();

const getStats = async (req: Request, res: Response) => {
  console.log("Connected", req.query, res);
  res.status(200).json({ message: "Connected Successfully to RAG" });
};

const ingestDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestDoctorsData();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors ingested successfully",
    data: result,
  });
});

const queryRag = catchAsync(async (req: Request, res: Response) => {

    const {query,limit,sourceType}=req.body;
    if(!query){
        return sendResponse(res,{
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Query is required",
        })
    }

    const result = await ragService.generateAnswer(query,limit??5, sourceType, true);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Answer generated successfully",
    data: result,
  });
});

export const RagController = {
  getStats,
  ingestDoctors,
    queryRag
};
