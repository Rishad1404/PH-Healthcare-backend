import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: RegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,

      //   default values for additional fields defined in auth configuration
      //   isDeleted: false,
      //   deletedAt: null,
      //   status: "ACTIVE",
      //   needPasswordChange: false,
      //   role: "PATIENT",
    },
  });
  if (!data.user) {
    throw new AppError(
      status.BAD_REQUEST,
      "Failed to create user account. Please try again.",
    );
  }

  try {
    //   TODO: Create Patient profile in transaction after sign up of patient in user model
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    console.log("Transaction failed, rolling back user creation", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });

    throw error;
  }
};

interface LoginUserPayload {
  email: string;
  password: string;
}
const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account is blocked. Please contact support.",
    );
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(
      status.NOT_FOUND,
      "Your account is deleted. Please contact support.",
    );
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { ...data, accessToken, refreshToken };
};

export const AuthService = {
  registerPatient,
  loginUser,
};
