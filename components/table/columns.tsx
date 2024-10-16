"use client"

import { ColumnDef } from "@tanstack/react-table" 
import { StatusBadge } from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/legacy/image"
import AppointmentModal from "../AppointmentModal"
import { Appointment } from "@/types/firebasetypes"



export const columns: ColumnDef<Appointment>[] = [
    {
        id: "id", 
        header: 'ID',
        cell: ({row}) => <p className="text-14-medium">{row.index + 1}</p>
    },

    {
       accessorKey: 'patient',
       header: 'Patient',
       cell: ({row}) => 
       <p className="text-14-medium">{row.original.name} - {row.original.id}</p>
       
    },
   
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => (
        <div className="min-w-[115px]">
            <StatusBadge status={row.original.status} />
        </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointments",
    cell: ({row}) => (
        <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)
      return <div className="flex items-center gap-3">
        <Image src={doctor?.image!}
            alt='doctor'
            width={60}
            height={60}
            className='size-8'
        />
        <p className="whitespace-nowrap">
            Dr. {doctor?.name}
        </p>
      </div>
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
        const appointment = row.original;
      return(
        <div className="flex gap-1">
        <AppointmentModal
            appointmentId={appointment.id}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
             appointmentId={appointment.id}
             appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
      </div>
      )
    },
  },
]