export type Status = "pending" | "scheduled" | "cancelled";

export interface Appointment {
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
  }

  

  export interface FilterProps {
      category: string;
      skinConcern: string;
      skinType: SkinType;
      limit: number
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
  }


  export interface StoreProps {
    searchParams: FilterProps;
  }
