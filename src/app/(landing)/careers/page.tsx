import { Metadata } from 'next';
import { siteDetails } from '@/data/siteDetails';
import CareersPage from '@/components/Careers/CareersPage';

export const metadata: Metadata = {
  title: `Careers | ${siteDetails.siteName}`,
  description: 'Join our team and be part of the automation revolution.',
};

export default function Careers() {
  return <CareersPage />;
}