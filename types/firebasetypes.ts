import { Dispatch, SetStateAction } from "react";

export type Status = "pending" | "scheduled" | "cancelled";
export type ProductStatus = "create" | "update";

export interface Patient{
  userId: string;
    birthDate: Date;
    gender: Gender;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    allergies: string | undefined;
    currentMedication: string | undefined;
    facePicture:  [] | undefined;
    privacyConsent: boolean;
}

export interface Appointment {
    patient: Patient,
    name: string;
    email: string;
    phoneNumber: string;
    location: 'Abuja' | 'Lagos';
    treatment: string;
    schedule: Date;
    status: Status;
    primaryPhysician: string;
    reason: string;
    note: string;
    appointmentId: string;
    cancellationReason: string | null;
    createdAt: Date
    id: string
    userId: string
  }

export interface UpdateAppointmentParams {
    appointmentId: string;
    appointment: Appointment;
    type: string;
  };

  

  export interface FilterProps {
      category: string;
      skinConcern: string;
      skinType: SkinType;
      limit: number
      id?: string
      formType?:ProductStatus
      productId?:string
  }

  export interface Products{
    name: string,
      price: string;
      category: string;
      skinConcern: string;
      skinType: SkinType;
      description: string;
      imageFiles: File[]
      images?: string[];
      id: string
      status: ProductStatus
  }



  export interface StoreProps {
    searchParams: FilterProps;
  }
export type SetProducts = Dispatch<SetStateAction<Products[]>>