// components/dashboard/Header.tsx
const Header = () => {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Welcome, [Patient Name]</h1>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Logout
        </button>
      </header>
    );
  };
  
  export default Header;
  