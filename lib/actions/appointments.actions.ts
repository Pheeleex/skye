"use server";

import { revalidatePath } from "next/cache";
import { ID, Permission, Query, Role } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

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


export const addProducts = async ({
  image,
  ...addedProduct
}: addProducts) => {
  const fileId = ID.unique()
  console.log('Generated productId:', fileId);
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    console.log(fileId, 'image')
    if (image) {
      const inputFile =
        image &&
        InputFile.fromBuffer(
          image?.get("blobFile") as Blob,
          image?.get("fileName") as string
        );
      
        file = await storage.createFile(STORE_BUCKETS_ID!, fileId, inputFile,);
      
    }
    const newProduct = await databases.createDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      fileId,
    
      {
        imageId: file?.$id ? file.$id : null,
       imageUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${STORE_BUCKETS_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...addedProduct,
       
      }
    );
    console.log(fileId, 'image id in documents')
    return parseStringify(newProduct);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

export const getProducts = async () => {
  try {
    // Fetch all products from the collection
    const productsResponse = await databases.listDocuments(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      [Query.orderAsc('$createdAt')] // Make sure you're sorting by a valid field
    );

    const products = productsResponse.documents;

    // Iterate through products to fetch their associated images
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        // Default imageUrl to null
        let imageUrl = null;

        //https://cloud.appwrite.io/v1/storage/buckets/66e71765001d44525c26/files/66e8f6280031e55e2b88/view?project=66d4c1f5002e402c51d9&project=66d4c1f5002e402c51d9&mode=admin
        // If the product has an imageId, try to fetch the image file from storage
        if (product.imageId) {
          try {
            // Fetch the file metadata to check if it exists
            const file = await storage.getFile(STORE_BUCKETS_ID!, product.imageId);
            console.log(file, 'files');

            if (file) {
              // If the file exists, generate the URL for the image
              imageUrl = `${ENDPOINT}/storage/buckets/${STORE_BUCKETS_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;
            }
          } catch (error) {
            // Type assertion to ensure 'error' has a 'code' property
            if (error instanceof Error && 'code' in error) {
              const appwriteError = error as { code: number };
              if (appwriteError.code === 404) {
                console.warn(`File not found for imageId ${product.imageId}. Skipping...`);
              } else {
                console.error(`Error fetching file metadata for imageId ${product.imageId}:`, error);
              }
            } else {
              console.error("Unexpected error occurred:", error);
            }
          }
        }

        // Return the product along with its image URL (null if image doesn't exist)
        return {
          ...product,
          imageUrl, // Attach the image URL (or null) to the product
        };
      })
    );

    // Return the list of products with their image URLs attached (skipping deleted/missing files)
    return productsWithImages;
  } catch (error) {
    console.error("An error occurred while fetching products:", error);
    return [];
  }
};


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