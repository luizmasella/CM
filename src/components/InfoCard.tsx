// FILE: src/components/InfoCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
  onClick: () => void;
}

export function InfoCard({ title, value, Icon, color, bgColor, onClick }: InfoCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-1 ${bgColor}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className={`text-sm font-medium ${color}`}>{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-full ${bgColor.replace('100', '200')}`}>
          <Icon className={`${color}`} size={24} />
        </div>
      </div>
    </div>
  );
}
