// FILE: src/components/Sidebar.tsx
import React from 'react';
import { Settings, UserPlus, Lock, LogOut } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Sidebar = () => {
  const { setActiveTab } = useUI();

  const handleLogout = () => {
    // Lógica de logout
  };

  const menuItems = [
    { id: 'config', label: 'Configuração', icon: Settings, action: () => setActiveTab('config') },
    { id: 'cadastro', label: 'Cadastro', icon: UserPlus, action: () => setActiveTab('cadastro') },
    { id: 'trocar-senha', label: 'Trocar Senha', icon: Lock, action: () => setActiveTab('trocar-senha') },
    { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Menu</h2>
      </div>
      <nav className="flex-1 p-2">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                onClick={item.action}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
