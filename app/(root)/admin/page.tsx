import StatCard from '@/components/StatCard'
import { columns } from '@/components/table/column'
import DataTable from '@/components/table/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointments.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



   

const Admin = async({searchParams}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';
 
    const appointments = await getRecentAppointmentList(appointmentId)
  return (
    <div className='mx-auto flex w-full flex-col 
    space-y-14 bg-[#110716]'>
        <header className='admin-header'>
            <Link href='/' className='cursor-pointer'>
                <Image 
                    src="assets/icons/logo-full.svg"
                    height={32}
                    width={162}
                    alt='logo'
                    className='h-8 w-fit'
                     />
            </Link>
            <p className="text-16-semibold">Admin Dashboard</p>
        </header>

        <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>
        <DataTable data={appointments.documents} columns={columns} /> 
       
        </main>
    </div>
  )
}

export default Admin