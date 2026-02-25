import { Prisma } from "../../../generated/prisma/client";

export const reviewSearchableFields: string[] = [
  "comment",
];

export const reviewFilterableFields: string[] = [
  "rating",
  "patientId",
  "doctorId",
  "appointmentId",
  "createdAt",
];

export const reviewIncludeConfig: Partial<Record<keyof Prisma.ReviewInclude, Prisma.ReviewInclude[keyof Prisma.ReviewInclude]>> = {
  appointment: true,
  patient: true,
  doctor: true,
};