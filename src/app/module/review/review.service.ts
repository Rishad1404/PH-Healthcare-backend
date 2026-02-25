import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";
import { IQueryParams } from "../../interfaces/query.interface";
import { Prisma } from "../../../generated/prisma/client";
import {
  reviewFilterableFields,
  reviewIncludeConfig,
  reviewSearchableFields,
} from "./review.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const giveReview = async (
  user: IRequestUser,
  payload: ICreateReviewPayload,
) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment is not completed for this appointment",
    );
  }

  if (appointmentData.patientId !== patientData.id) {
    throw new AppError(status.BAD_REQUEST, "This is not your appointment");
  }

  const isReviewed = await prisma.review.findFirst({
    where: {
      appointmentId: payload.appointmentId,
    },
  });

  if (isReviewed) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already reviewed this appointment. Please edit your review instead",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: review.doctorId,
      },
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: review.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return review;
  });
  return result;
};

const getAllReviews = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Prisma.ReviewWhereInput,
    Prisma.ReviewInclude
  >(prisma.review, query, {
    filterableFields: reviewFilterableFields,
    searchableFields: reviewSearchableFields,
  });
  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(reviewIncludeConfig)
    .sort()
    .fields()
    .execute();
  return result;
};

const myReviews = async (user: IRequestUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });
  if (!isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "Only patients can view their reviews",
    );
  }

  if (isUserExist.role === Role.DOCTOR) {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user?.email,
      },
    });
    return await prisma.review.findMany({
      where: {
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        appointment: true,
      },
    });
  }

  if (isUserExist.role === Role.PATIENT) {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user?.email,
      },
    });
    return await prisma.review.findMany({
      where: {
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        appointment: true,
      },
    });
  }
};

const updateReview = async (
  user: IRequestUser,
  reviewId: string,
  payload: IUpdateReviewPayload,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError(status.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...payload,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: reviewData.doctorId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: updatedReview.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });

    return updatedReview;
  });

  return result;
};

const deleteReview = async (user: IRequestUser, reviewId: string) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError(status.BAD_REQUEST, "This is not your review!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: {
        id: reviewId,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: deletedReview.doctorId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: deletedReview.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return deletedReview;
  });

  return result;
};

export const ReviewService = {
  giveReview,
  getAllReviews,
  myReviews,
  updateReview,
  deleteReview,
};
