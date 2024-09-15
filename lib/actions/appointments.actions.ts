"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  SKYE_APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import App from "next/app";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    // SMS Notification
    const phoneNumber = '+2349074358404'; // Hardcoded phone number
    const smsMessage = `Greetings from CarePulse. Your appointment has been successfully scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}.`;

    await sendSMSNotification(phoneNumber, smsMessage);  // Send SMS

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};


export const addSkyeAppointment = async (appointment: AddBookingParams) => {
  try {
    const addAppointment = await databases.createDocument(
      DATABASE_ID!,
      SKYE_APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment,
    );

    return parseStringify(addAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
}


export const getAppointment = async (appointmentId: string) =>{
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    )
    console.log(appointment, 'getAppointment', appointmentId)
    return parseStringify(appointment)
   
  } catch (error) {
    console.log(error)
  }
}

export const getRecentAppointmentList = async (appointmentId: string) => {
  try{
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$id")]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

  const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) =>
  {
    if(appointment.status === 'scheduled'){
      acc.scheduledCount += 1;
    }
    else if(appointment.status === 'pending'){
      acc.pendingCount += 1;
    }
    else if (appointment.status === 'cancelled'){
      acc.cancelledCount += 1;
    }

    return acc;
  }, initialCounts)

  const data = {
    totalCount: appointments.total,
    ...counts,
    documents: appointments.documents
  }
  return parseStringify(data)
  } catch(error){
    console.log(error)
  }
 
}


//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
  
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    
      appointment
    );

    if (!updatedAppointment) throw Error;

    //SMS NOTIFICATION

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your 
    appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} 
    with Dr. ${appointment.primaryPhysician}` : `We regret to inform that 
    your appointment for ${formatDateTime(appointment.schedule!).dateTime} 
    is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    await sendSMSNotification(userId, smsMessage);


    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};