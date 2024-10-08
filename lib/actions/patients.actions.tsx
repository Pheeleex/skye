'use server'
import { ID, Query } from "node-appwrite";
import { BUCKET_ID, 
  DATABASE_ID, 
  databases, 
  ENDPOINT, 
  PROJECT_ID,
  PATIENT_COLLECTION_ID,
  PATIENT_DETAILS_COLLECTION_ID,
  SKYE_APPOINTMENT_COLLECTION_ID,
  storage, 
  users 
} from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from 'node-appwrite/file';

export const createUser = async(user: CreateUserParams)=>{
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log(newUser, 'new user')
        return parseStringify(newUser)
    } catch (error: any) {
      console.log("createUser error", error);
      if (error?.code === 409) {
        throw new Error("A user with this email or phone number already exists.");
      }
      throw new Error("An unexpected error occurred.");
    }
}



export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId)
      return parseStringify(user)
    } catch (error) {
      console.log(error)  
    }
}

export const registerPatient = async ({
    identificationDocument,
    ...patient
  }: RegisterUserParams) => {
    try {
      // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
      let file;
      if (identificationDocument) {
        const inputFile =
          identificationDocument &&
          InputFile.fromBuffer(
            identificationDocument?.get("blobFile") as Blob,
            identificationDocument?.get("fileName") as string
          );
  
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      }
      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id ? file.$id : null,
          identificationDocumentUrl: file?.$id
            ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
            : null,
          ...patient,
        }
      );
  
      return parseStringify(newPatient);
    } catch (error) {
      console.error("An error occurred while creating a new patient:", error);
    }
  };

  

export const addPatientDetails = async ({
  facePicture,
  ...patient
}: PatientDetailsParams) => {
  try {
    let file;
    const patientId = ID.unique(); // Generate unique patient ID

    // Upload identificationDocument to storage if it exists
    if (facePicture) {
      const inputFile =
        facePicture &&
        InputFile.fromBuffer(
         facePicture.get("blobFile") as Blob,
         facePicture.get("fileName") as string
        );

      // Upload file to the Appwrite storage and get the file details
      file = await storage.createFile(
        BUCKET_ID!,
        `${patientId}`, // Use patientId and unique ID for the file
        inputFile
      );
    }
    console.log(file?.$id, 'fileid1')
    // Create the patient document in the database and include the file data
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_DETAILS_COLLECTION_ID!,
      patientId,
      {
        ...patient,
        facePictureId: file?.$id || null,
        facePictureUrl: file
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
      }
    );
    console.log(file?.$id, 'fileid2')

    return parseStringify(newPatient); // Return the newly created patient data
  } catch (error) {
    console.error("An error occurred while registering the patient:", error);
    throw error; // Throw error for further handling (optional)
  }
};


  // GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};