import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ClientTracker from '@/components/ClientTracker';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Client Tracker | Aangan',
};

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/');
  }

  const user = session.user as any;
  if (user.role !== 'seller') {
    redirect('/dashboard');
  }

  // Fetch leads for properties owned by this user
  const leads = await prisma.lead.findMany({
    where: {
      sellerId: user.id,
    },
    include: {
      property: {
        select: {
          title: true,
          location: true,
          displayPrice: true,
          price: true,
          imageUrl: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <>
      <Navbar />
      <main className="dashboard-container page-container-standard">
        <div className="page-header-flex">
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="text-muted">
              Welcome back, {user.name}! Manage your properties and incoming leads.
            </p>
          </div>
          <Link href="/list-property" className="btn-primary">+ Post New Property</Link>
        </div>

        <div className="dashboard-tabs">
          <Link 
            href="/dashboard" 
            className="dashboard-tab-item"
          >
            My Properties / Leads
          </Link>
          <button 
            className="dashboard-tab-item active"
          >
            Client Tracker
          </button>
        </div>

        <ClientTracker initialLeads={leads as any} />
      </main>
      <Footer />
    </>
  );
}
