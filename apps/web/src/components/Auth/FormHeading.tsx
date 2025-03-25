import React from 'react';

interface FormHeadingProps {
  title: string;
  subtitle: string;
}

export function FormHeading({ title, subtitle }: FormHeadingProps) {
  return (
    <div className="px-6 pt-6 pb-4">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="mt-1 text-center text-xs text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}