/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma"

const getAllDoctors=async()=>{
    const doctors=await prisma.doctor.findMany({
        include:{
            user:true,
            specialties:{
                include:{
                    specialty:true
                }
            }
        }
    })
    return doctors;
}


const getDoctorById=async(id:string)=>{
    const doctor=await prisma.doctor.findUnique({
        where:{
            id
        }
    })
    return doctor;
}


const updateDoctor=async(id:string,payload:any)=>{
    const doctor=await prisma.doctor.update({
        where:{
            id
        },
        data:{
            ...payload
        }
    })
    return doctor;
}

const deleteDoctor=async(id:string)=>{
    await prisma.$transaction(async(prisma)=>{
        await prisma.doctor.delete({
            where:{
                id
            }
        })
    })
}

export const DoctorService={
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}