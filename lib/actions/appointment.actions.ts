"use server";
import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  messaging,
} from "../appwrite.config";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";

function parseStringify<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      ID.unique(),
      appointment
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointment = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCounts = {
      scheduleCount: 0,
      pendingCount: 0,
      canceledCount: 0,
    };
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduleCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "canceled") {
          acc.canceledCount += 1;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Log userId for debugging
    console.log("updateAppointment called with userId:", userId);

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updateAppointment) {
      throw new Error("Appointment not found");
    }
    const smsMessage = `
    Hi, it's CarePulse.
    ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${formatDateTime(
            appointment.schedule
          )}`
        : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
    }
    `;
    await sendSmsNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSmsNotification = async (userId: string, content: string) => {
  // Validate userId: max 36 chars, only a-z, A-Z, 0-9, and underscore, can't start with underscore
  if (!userId || typeof userId !== "string") {
    console.error(`userId is missing or not a string:`, userId);
    return;
  }
  const validUserId = /^[a-zA-Z0-9][a-zA-Z0-9_]{0,35}$/.test(userId);
  if (!validUserId) {
    console.error(`Invalid userId for SMS: "${userId}"`);
    return;
  }
  // Debug: log the userId being sent
  console.log("Sending SMS to userId:", userId);
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      { users: [userId] }
    );
    return parseStringify(message);
  } catch (error) {
    console.log("Appwrite SMS error:", error);
  }
};
