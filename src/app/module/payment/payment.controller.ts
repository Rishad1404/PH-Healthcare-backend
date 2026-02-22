/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { envVars } from "../../../config/env";
import status from "http-status";
import { stripe } from "../../../config/stripe.config";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";
import { send } from "node:process";

const handleStripeHookEvent=catchAsync(async(req:Request,res:Response)=>{
    const signature=req.headers['stripe-signature'] as string;
    const webhookSecret=envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

    if(!signature || !webhookSecret){
        console.log(`Missing Stripe signature or webhook secret`);
        return res.status(status.BAD_REQUEST).json({
            message:`Missing Stripe signature or webhook secret`
        });
    }

    let event;
    try{
        event=stripe.webhooks.constructEvent(req.body,signature,webhookSecret);
    }catch(error:any){
        console.log(`Webhook signature verification failed`,error);
    }

    try {
        const result=await paymentService.handleStripeHookEvent(event as any);
        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"Stripe Webhook event processed successfully",
            data:result
        })
    } catch (error:any) {
        console.log(`Error processing Stripe webhook event`,error);
        sendResponse(res,{
            httpStatusCode:status.INTERNAL_SERVER_ERROR,
            success:false,
            message:"Error processing Stripe webhook event",
        })
    }
})

export const PaymentController={
    handleStripeHookEvent
}