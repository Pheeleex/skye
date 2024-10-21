'use client'
// components/dashboard/Sidebar.tsx
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import AppointmentModal from '../AppointmentModal';
import { Patient } from '@/types/firebasetypes';


const Sidebar = ({patient}:{patient: Patient}) => {
  const router = useRouter();
  const pathName = usePathname()
  const { id } = useParams();
  const menuItems = [
    { name: 'Dashboard', path: '/patients/[id]/dashboard' },
    { name: 'Appointments', path: '/patients/[id]/appointments' },
    { name: 'Prescriptions', path: '/patients/[id]/prescriptions' },
    { name: 'Profile', path: '/patients/[id]/profile' },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Patient Dashboard</h2>
        <AppointmentModal
            type='create'
            user='client'
            patient={patient}
        />
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path.replace('[id]', id as string)}
              className='block p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
