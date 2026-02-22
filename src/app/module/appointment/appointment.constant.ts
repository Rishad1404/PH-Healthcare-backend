import { Prisma } from "../../../generated/prisma/client"

export const appointmentSearchableFields=['id']

export const appointmentFilterableFields=[
    'id',
    'doctorId',
    'patientId',
    'scheduleId',
    'createdAt',
    'updatedAt',
    'isBooked',
    'schedule.startDateTime',
    'schedule.endDateTime',
]

export const appointmentIncludeConfig : Partial<Record<keyof Prisma.AppointmentInclude, Prisma.AppointmentInclude[keyof Prisma.AppointmentInclude]>> ={
    doctor: {
        include: {
            user: true,
            appointments: true,
            specialties: true,
        }
    },
    patient: true,
    schedule: true
}