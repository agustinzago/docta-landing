import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface SocialButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SocialButton({ onClick, icon = <FcGoogle className="mr-2 h-4 w-4" />, children }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mb-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {icon}
      {children}
    </button>
  );
}