import React, { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg ">
      {children}
    </div>
  );
}