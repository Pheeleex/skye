/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  declare type Gender = "male" | "female" | "other";
  declare type Location = 'Abuja' | 'Lagos'
  declare type Status = "pending" | "scheduled" | "cancelled";
  declare type SkinType = 'Oily Skin' | 'Dry Skin' | 'Combnation Skin' | 'Normal Skin' | 'Sensitive Skin'
  declare type consultationType = 'Online Consultation' | 'In person consultation'
  

  
  declare interface CreateUserParams {
    name: string;
    email: string;
    phone: string;
  }
  declare interface User extends CreateUserParams {
    $id: string;
  }
  
  declare interface Product extends CreateUserParams {
    $id: string;
  }

  declare interface AddBookingParams {
    name: string;
    email: string;
    phoneNumber: string;
    location: Location
    treatment: string;
    reason: string;
    schedule: Date;
    note: string | undefined;
  }

  declare interface addProducts{
    name: string,
      price: string;
      category: string;
      skinConcern: string;
      skinType: SkinType;
      description: string;
      images: string[] | undefined
      productId: string
      id: string
  }

  declare interface Product extends addProducts {
    $id: string;
  }


  declare interface RegisterUserParams extends CreateUserParams {
    userId: string;
    birthDate: Date;
    gender: Gender;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies: string | undefined;
    currentMedication: string | undefined;
    familyMedicalHistory: string | undefined;
    pastMedicalHistory: string | undefined;
    identificationType: string | undefined;
    identificationNumber: string | undefined;
    identificationDocument: FormData | undefined;
    privacyConsent: boolean;
  }

  declare interface PatientDetailsParams extends CreateUserParams {
    userId: string;
    birthDate: Date;
    gender: Gender;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    allergies?: string | undefined;
    currentMedication?: string | undefined;
    facePicture?:  File[] | undefined;
    images?: string
    privacyConsent: boolean;
  }
  
  declare type ointmentParams = {
    name: string;
    email: string;
    phoneNumber: string;
    Location: Location
    treatment: string;
    primaryPhysician: string;
    reason: string;
    schedule: Date;
    status: Status;
    note: string | undefined;
    id: string;
    createdAt: Date
  };
  
 
  

  