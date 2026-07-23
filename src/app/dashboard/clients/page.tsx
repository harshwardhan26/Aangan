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
      <main className="dashboard-container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Welcome back, {user.name}! Manage your properties and incoming leads.
            </p>
          </div>
          <Link href="/list-property" className="btn-primary" style={{ textDecoration: 'none' }}>+ Post New Property</Link>
        </div>

        <div className="dashboard-tabs" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
          <Link 
            href="/dashboard" 
            className="auth-tab" 
            style={{ textDecoration: 'none', color: 'inherit', background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: '3px solid transparent', fontWeight: '400' }}
          >
            My Properties / Leads
          </Link>
          <button 
            className="auth-tab active" 
            style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: '3px solid #000', fontWeight: '600' }}
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
