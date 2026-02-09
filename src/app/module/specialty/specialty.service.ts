import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


// create Specialty---------------------------------------------------------------------------------------------------
const createSpecialty=async(payload:Specialty):Promise<Specialty>=>{
    const specialty=await prisma.specialty.create({
        data:payload
    })
    return specialty;
}

// update Specialty---------------------------------------------------------------------------------------------------
const updateSpecialty=async(specialtyId:string,payload:Specialty):Promise<Specialty>=>{
    const specialty=await prisma.specialty.update({
        where:{
            id:specialtyId
        },
        data:payload
    })
    return specialty;
}   

// get all Specialties---------------------------------------------------------------------------------------------------
const getAllSpecialties=async():Promise<Specialty[]>=>{
    const specialties=await prisma.specialty.findMany();
    return specialties;
}

// update Specialty---------------------------------------------------------------------------------------------------

const deleteSpecialty=async(specialtyId:string):Promise<Specialty>=>{
    const specialty=await prisma.specialty.delete({
        where:{
            id:specialtyId
        }
    })
    return specialty;
}


            
export const SpecialtyService = {
    createSpecialty,
    getAllSpecialties,
    updateSpecialty,    
    deleteSpecialty
}