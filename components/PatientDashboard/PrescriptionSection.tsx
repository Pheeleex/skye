// components/dashboard/PrescriptionSection.tsx
const PrescriptionSection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
        {/* Replace this with actual prescription data */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Medication: Ibuprofen</h3>
            <p className="text-sm text-gray-600">Dosage: 200mg, twice daily</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Medication: Amoxicillin</h3>
            <p className="text-sm text-gray-600">Dosage: 500mg, three times daily</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default PrescriptionSection;
  