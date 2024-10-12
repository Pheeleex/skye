'use server'

import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase"
import { Patient } from "@/types/firebasetypes";



export const addPatients = async (patientData: Patient, imageUrls: string[]): Promise<void> => {
  try {
    const patientRef = collection(db, 'patients');

    // Add patient data along with image URLs (plain data)
    await addDoc(patientRef, {
      ...patientData,
      images: imageUrls, // Pass only serializable values
    });

    console.log('Patient added successfully with image URLs');
  } catch (error) {
    console.error('Error adding patient to database:', error);
  }
};


export const fetchAllPatients = async () => {
  try {
    const patientsRef = collection(db, "patients");
    const snapshot = await getDocs(patientsRef);
    
    // Map through the snapshot to return all patients
    const patients = snapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(),
    }));

    return patients;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    throw new Error("Unable to fetch patient data");
  }
};


export const fetchPatientById = async (userId: string) => {
  try {
    const patientsRef = collection(db, 'patients');  // Reference to the collection

    // Query to filter by user id and order by createdAt
    const patientsQuery = query(
      patientsRef, 
      where("userId", "==", userId) // Filter based on the user's I  // Order the results if needed
    );
    console.log(userId, 'userId in console')
     // Fetch the matching documents
     const patientSnapshot = await getDocs(patientsQuery);

     // Check if there's a matching document
     if (patientSnapshot.empty) {
       return null; // Return null if no appointment matches the id
     }

      // Map the document data into an Appointment object
    const patient = patientSnapshot.docs.map((doc) => {
      const data = doc.data();
      

      return {
        ...data,    // Spread the document data // Use the converted Date object or the original string
      } as PatientDetailsParams;  // Cast as Appointment type
    })[0]; // Since we expect only one result, use the first match

    // Return the found appointment
    return patient;
  } catch (error) {
    console.log("Error fetching appointment:", error);
    throw new Error("Failed to fetch appointment");  // Throw an error for easier debugging
  }
};


export const checkPatientExists = async (name: string, email: string, phone: string): Promise<string | null> => {
  try {
    // Reference the "patients" collection
    const patientRef = collection(db, 'patients');

    // Query Firestore for a document where name, email, and phone match
    const q = query(
      patientRef,
      where('name', '==', name),
      where('email', '==', email),
      where('phone', '==', phone)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If a match is found, return the userId of the first match
    if (!querySnapshot.empty) {
      const matchedPatient = querySnapshot.docs[0].data();
      return matchedPatient.userId; // Return the userId
    }

    // If no match is found, return null
    return null;
  } catch (error) {
    console.error("Error checking patient existence:", error);
    throw error
    return null;
  }
};