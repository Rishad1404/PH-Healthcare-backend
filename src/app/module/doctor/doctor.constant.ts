import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields=['name','email','qualification','currentWorkplace','registrationNumber','designation','specialties.specialty.title'];

export const doctorFilterableFields=['gender','specialties.specialty.title','user.role','isDeleted','appointmentFee','experience','registrationNumber','specialties.specialtyId','currentWorkplace','designation','qualification'];

export const doctorIncludeConfig:Partial<Record<keyof Prisma.DoctorInclude,Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>>={
    user:true,
    specialties:{
        include:{
            specialty:true
        }
    },
    appointments:{
        include:{
            patient:true,
            doctor:true,
            prescription:true,
        }
    },
    doctorSchedules:{
        include:{
            schedule:true,
        }
    },
    prescriptions:true,
    reviews:true
}