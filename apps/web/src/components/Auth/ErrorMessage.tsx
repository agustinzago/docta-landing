import React from 'react';
import { BsExclamationCircle } from 'react-icons/bs';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mx-6 mb-4 rounded-md bg-red-50 p-3">
      <div className="flex items-center">
        <BsExclamationCircle className="h-4 w-4 text-red-400" />
        <div className="ml-2">
          <p className="text-xs font-medium text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}