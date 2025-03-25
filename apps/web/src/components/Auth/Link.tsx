import React from 'react';
import Link from 'next/link';

interface AuthLinkProps {
  question: string;
  linkText: string;
  href: string;
}

export function AuthLink({ question, linkText, href }: AuthLinkProps) {
  return (
    <div className="mt-4 text-center text-xs text-gray-600">
      {question}{' '}
      <Link href={href} className="font-medium text-indigo-600 hover:text-indigo-500">
        {linkText}
      </Link>
    </div>
  );
}