import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
    throw new Error("Failed to register patient");
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

    return {
      ...data,
      patient,
    };
  } catch (error) {
    console.log("Transaction failed, rolling back user creation", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    })

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
    throw new Error("Your account is blocked. Please contact support.");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error("Your account is deleted. Please contact support.");
  }

  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
