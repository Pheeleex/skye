"use server";

import { revalidatePath } from "next/cache";
import { ID, Permission, Query, Role } from "node-appwrite";


import {
  APPOINTMENT_COLLECTION_ID,
  SKYE_APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  PRODUCTS_COLLECTION_ID,
  databases,
  messaging,
  storage,
  STORE_BUCKETS_ID,
  BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import App from "next/app";
import { InputFile } from "node-appwrite/file";
import { collection, doc, DocumentData, getDocs, orderBy, query, QueryDocumentSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Appointment } from "@/types/firebasetypes";




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


// Function to get and count appointments from Firestore
export const getAppointmentList = async (appointmentId: string) => {
  try {
    const appointmentsRef = collection(db, 'skyeAppointment');  // Reference to the collection
    const appointmentsQuery = query(appointmentsRef, orderBy("createdAt", "desc"));  // Query with order
    const appointmentSnapshot = await getDocs(appointmentsQuery);  // Fetch documents

    // Map the documents into an Appointment array, converting timestamps if necessary
    const appointments = appointmentSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamps to Date objects (if schedule is a Timestamp)
      if (data.schedule && data.schedule.toDate) {
        data.schedule = data.schedule.toDate(); // Convert to Date object
      }

      return {
        ...data,    // Spread the data
        id: doc.id  // Add the document id to the object
      } as Appointment;  // Cast as Appointment type
    });

    // Initial counts for each status
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Reduce over appointments to calculate the counts based on status
    const counts = appointments.reduce((acc, appointment) => {
      if (appointment.status === 'scheduled') {
        acc.scheduledCount += 1;
      } else if (appointment.status === 'pending') {
        acc.pendingCount += 1;
      } else if (appointment.status === 'cancelled') {
        acc.cancelledCount += 1;
      }

      return acc;
    }, initialCounts);

    // Prepare the final result
    const data = {
      totalCount: appointmentSnapshot.size,  // Total number of documents fetched
      ...counts,                             // Spread the counts
      documents: appointments,               // The appointments array
    };

    // Return the result as a stringified object (if needed)
    return parseStringify(data);
  
  } catch (error) {
    console.log("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");  // Throw an error for easier debugging
  }
};



{/** export const getAppointmentList = async() => {
  try {
    const appointmentsRef = collection(db, 'skyeAppointment');
    const appointmentsQuery = query(appointmentsRef, orderBy("id", "desc"));
    const appointmentSnapshot = await getDocs(appointmentsQuery);

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointmentSnapshot.docs.reduce((acc, doc: QueryDocumentSnapshot<DocumentData>) => {
      const appointment = doc.data();

      // Convert Firestore Timestamps to Date objects
      if (appointment.schedule && appointment.schedule.toDate) {
        appointment.schedule = appointment.schedule.toDate();  // Convert to Date
      }

      if (appointment.createdAt && appointment.createdAt.toDate) {
        appointment.createdAt = appointment.createdAt.toDate();  // Convert to Date
      }

      // Increment counts based on status
      if (appointment.status === 'scheduled') {
        acc.scheduledCount += 1;
      } else if (appointment.status === 'pending') {
        acc.pendingCount += 1;
      } else if (appointment.status === 'cancelled') {
        acc.cancelledCount += 1;
      }

      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointmentSnapshot.size,
      ...counts,
      documents: appointmentSnapshot.docs.map(doc => {
        const appointmentData = doc.data();
        
        // Ensure all Timestamps are converted before returning
        return {
          appointmentId: doc.id,
          ...appointmentData,
          schedule: appointmentData.schedule?.toDate(), // Convert if exists
          createdAt: appointmentData.createdAt?.toDate(), // Convert if exists
        };
      }),
    };

    return data;
  } catch (error) {
    console.log("Error fetching appointments:", error);
    return null;
  }
};  **/}



//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointment,
  type,
  
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointment
    );

    if (!updatedAppointment) throw Error;

    //SMS NOTIFICATION

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your 
    appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} 
    with Dr. ${appointment.primaryPhysician}` : `We regret to inform that 
    your appointment for ${formatDateTime(appointment.schedule!).dateTime} 
    is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    //await sendSMSNotification(appointmentId, smsMessage);


    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};





export const updateAppointments = async (userId: string, appointmentToUpdate: { appointment: Partial<Appointment>, type: string }) => {
  const appointmentId = appointmentToUpdate.appointment.id; // Get the id from the appointment object

  if (!appointmentId) {
    throw new Error("Appointment ID is required for updating an appointment.");
  }

  try {
    const appointmentRef = doc(db, 'skyeAppointment', appointmentId); // Reference the specific document

    // Update the document with new values
    await updateDoc(appointmentRef, {
      ...appointmentToUpdate.appointment,
      // Add any other fields to update if necessary
    });

    console.log('Appointment updated successfully:', appointmentId);
    return true; // Return true or any relevant data indicating success
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error; // Propagate the error
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