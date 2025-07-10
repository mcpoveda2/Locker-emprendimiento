import { Link, useLocation } from "react-router-dom";
import { Home, Lock, Box, Settings } from "lucide-react";

function BottomNav() {
  const location = useLocation();

  const tabs = [
    { to: "/", icon: <Home size={20} />, label: "Inicio" },
    { to: "/generator", icon: <Lock size={20} />, label: "Generar" },
    { to: "/almacenador", icon: <Box size={20} />, label: "Almacén" },
    { to: "/ajustes", icon: <Settings size={20} />, label: "Ajustes" },
  ];

  return (
    <nav className="bg-white shadow p-2 flex justify-around border-t fixed bottom-0 left-0 right-0">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`flex flex-col items-center text-xs ${
            location.pathname === tab.to ? "text-green-600" : "text-gray-500"
          }`}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;
