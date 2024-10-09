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
import { addDoc, collection, doc, DocumentData, getDocs, orderBy, query, QueryDocumentSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Appointment } from "@/types/firebasetypes";
import twilio from 'twilio';


const accountSid = process.env.TW_ACCOUNT_SID; // Your Account SID from .env.local
const authToken = process.env.AUTH_TOKEN; // Your Auth Token from .env.local
const client = twilio(accountSid, authToken);




export const createSkyeAppointment = async ({id,...appointment}:CreateAppointmentParams) => {
  try {
    const appointmentRef = collection(db, 'skyeAppointment');
    
    // Include the createdAt field with the current timestamp
    const appointmentWithTimestamp = {
      ...appointment,
      id,
    };

    // Add the document to Firestore
    const docRef = await addDoc(appointmentRef, appointmentWithTimestamp);

    // Log the document ID and other details
    console.log('Appointment added successfully:', docRef.id);
    console.log('Document Reference:', docRef);

    // Send SMS notification to the admin
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
    const userName = appointment.name;  // Retrieve the name of the user who created the appointment


    try {
      const message = await client.messages.create({
        body: `An appointment has been created by ${userName}. Please go and confirm availability.`,
        from: appointment.phoneNumber,  // Replace with your Twilio number
        to: '+2349074358404'  // Admin's phone number
      });

      console.log('SMS sent successfully:', message.sid);
    } catch (smsError) {
      // Handle errors related to Twilio SMS sending
      console.error('Error sending SMS:', smsError);

      // Optionally log the error in Firestore or another logging service
      // For example, you could create an error log in Firestore:
      const errorRef = collection(db, 'smsErrors');
      await addDoc(errorRef, {
        error: smsError.message,
        timestamp: new Date().toISOString(),
        appointmentId: docRef.id,
        username: userName
      });

      // Return a response with error details if necessary
      return {
        error: 'SMS not sent. Please check Twilio configuration.',
        appointmentId: docRef.id,
        username: userName
      };
    }
   
    // Return the document ID or other useful information
    return {
      ...appointmentWithTimestamp,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};


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






export const updateAppointments = async (userId: string, appointmentToUpdate: { appointment: Partial<Appointment>, type: string }) => {
  const appointmentId = appointmentToUpdate.appointment.id; // Get the id from the appointment object

  if (!appointmentId) {
    throw new Error("Appointment ID is required for updating an appointment.");
  }

  try {
    const appointmentRef = doc(db, 'skyeAppointment', appointmentId); // Reference the specific document

    // Update the document with new values
    const updatedAppointment = await updateDoc(appointmentRef, {
      ...appointmentToUpdate.appointment,
      // Add any other fields to update if necessary
    });
    console.log('Appointment updated successfully:', appointmentId);
    revalidatePath('/admin')
    return updatedAppointment
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