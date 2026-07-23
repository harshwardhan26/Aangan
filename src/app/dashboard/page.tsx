'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getMyPropertiesAction } from '@/actions/dashboard';
import { getSellerLeadsAction } from '@/actions/leads';
import { getSavedPropertiesAction, getBuyerInquiriesAction } from '@/actions/buyer';
import LoginModal from '@/components/LoginModal';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'leads' | 'saved' | 'inquiries'>('properties');
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (status === 'loading') return;
      
      if (user) {
        try {
          const parsed = user;
          if (parsed.role === 'seller') {
            const res = await getMyPropertiesAction(parsed.id);
            if (res.success && res.properties) {
              setProperties(res.properties);
            }
            const leadsRes = await getSellerLeadsAction(parsed.id);
            if (leadsRes.success && leadsRes.leads) {
              setLeads(leadsRes.leads);
            }
            setActiveTab('properties');
          } else {
            const savedRes = await getSavedPropertiesAction(parsed.id);
            if (savedRes.success && savedRes.savedProperties) {
              setSavedProperties(savedRes.savedProperties);
            }
            const inquiriesRes = await getBuyerInquiriesAction(parsed.id);
            if (inquiriesRes.success && inquiriesRes.leads) {
              setInquiries(inquiriesRes.leads);
            }
            setActiveTab('saved');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setLoading(false);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, [status, user?.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="dashboard-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Loading your dashboard...</h2>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="dashboard-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>You must be logged in to view your dashboard.</h2>
          <button className="btn-primary" onClick={() => setIsLoginOpen(true)}>Log In Now</button>
        </main>
        <Footer />
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onSuccess={(loggedInUser) => {
            setIsLoginOpen(false);
            window.location.reload(); // Quick refresh to load dashboard
          }}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Welcome back, {user.name}! {user.role === 'seller' ? 'Manage your properties and incoming leads.' : 'Manage your saved properties and inquiries.'}
            </p>
          </div>
          {user.role === 'seller' ? (
            <Link href="/list-property" className="btn-primary" style={{ textDecoration: 'none' }}>+ Post New Property</Link>
          ) : (
            <Link href="/search" className="btn-primary" style={{ textDecoration: 'none' }}>Explore Properties</Link>
          )}
        </div>

        {user.role === 'seller' ? (
          <div className="dashboard-tabs" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
            <button 
              className={`auth-tab ${activeTab === 'properties' ? 'active' : ''}`} 
              onClick={() => setActiveTab('properties')}
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'properties' ? '3px solid #000' : '3px solid transparent', fontWeight: activeTab === 'properties' ? '600' : '400' }}
            >
              My Properties
            </button>
            <button 
              className={`auth-tab ${activeTab === 'leads' ? 'active' : ''}`} 
              onClick={() => setActiveTab('leads')}
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'leads' ? '3px solid #000' : '3px solid transparent', fontWeight: activeTab === 'leads' ? '600' : '400' }}
            >
              My Leads <span style={{ background: '#ef4444', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>{leads.length}</span>
            </button>
          </div>
        ) : (
          <div className="dashboard-tabs" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
            <button 
              className={`auth-tab ${activeTab === 'saved' ? 'active' : ''}`} 
              onClick={() => setActiveTab('saved')}
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'saved' ? '3px solid #000' : '3px solid transparent', fontWeight: activeTab === 'saved' ? '600' : '400' }}
            >
              Saved Properties <span style={{ background: '#10b981', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>{savedProperties.length}</span>
            </button>
            <button 
              className={`auth-tab ${activeTab === 'inquiries' ? 'active' : ''}`} 
              onClick={() => setActiveTab('inquiries')}
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'inquiries' ? '3px solid #000' : '3px solid transparent', fontWeight: activeTab === 'inquiries' ? '600' : '400' }}
            >
              My Inquiries
            </button>
          </div>
        )}

        {activeTab === 'properties' ? (
          properties.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '10px' }}>No properties listed yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't posted any properties on Aangan yet.</p>
              <Link href="/list-property" className="btn-outline" style={{ textDecoration: 'none' }}>List a Property for Free</Link>
            </div>
          ) : (
            <div className="property-grid">
              {properties.map(property => (
                <Link href={`/property/${property.id}`} key={property.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="property-card">
                    <div className="card-img-wrapper">
                      <img src={property.imageUrl} alt={property.title} />
                      <span className="badge" style={{ background: '#10b981' }}>Active</span>
                    </div>
                    <div className="card-content">
                      <div className="price">{property.displayPrice}</div>
                      <h4>{property.title}</h4>
                      <p className="location">{property.location}</p>
                      <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
                        <span>🛏️ {property.bedrooms} BHK</span>
                        <span className="dot" style={{ margin: '0 8px' }}>·</span>
                        <span>📐 {property.areaSqft} sqft</span>
                      </div>
                      <button className="btn-outline w-100" style={{ background: '#f1f5f9', border: 'none' }}>View Live Listing</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : activeTab === 'leads' ? (
           leads.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '10px' }}>No leads yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>When buyers inquire about your properties, their details will appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Buyer Details</th>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Property</th>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ fontWeight: '500' }}>{lead.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>📞 +91 {lead.phone}</div>
                        {lead.email && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>✉️ {lead.email}</div>}
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <Link href={`/property/${lead.propertyId}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                          {lead.property.title}
                        </Link>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{lead.property.displayPrice}</div>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'saved' ? (
          savedProperties.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '10px' }}>No saved properties</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't saved any properties yet. Click the heart icon on any property to save it here.</p>
              <Link href="/search" className="btn-outline" style={{ textDecoration: 'none' }}>Browse Properties</Link>
            </div>
          ) : (
            <div className="property-grid">
              {savedProperties.map(property => (
                <Link href={`/property/${property.id}`} key={property.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="property-card">
                    <div className="card-img-wrapper">
                      <img src={property.imageUrl} alt={property.title} />
                      <span className="badge" style={{ background: '#10b981' }}>Saved</span>
                    </div>
                    <div className="card-content">
                      <div className="price">{property.displayPrice}</div>
                      <h4>{property.title}</h4>
                      <p className="location">{property.location}</p>
                      <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
                        <span>🛏️ {property.bedrooms} BHK</span>
                        <span className="dot" style={{ margin: '0 8px' }}>·</span>
                        <span>📐 {property.areaSqft} sqft</span>
                      </div>
                      <button className="btn-outline w-100" style={{ background: '#f1f5f9', border: 'none' }}>View Property</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : activeTab === 'inquiries' ? (
          inquiries.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '10px' }}>No inquiries yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>When you contact agents about properties, your requests will appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Property Inquired</th>
                    <th style={{ padding: '15px 20px', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inquiry => (
                    <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={inquiry.property.imageUrl} alt={inquiry.property.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <Link href={`/property/${inquiry.propertyId}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                              {inquiry.property.title}
                            </Link>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{inquiry.property.location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                          Sent to Agent
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </main>
      <Footer />
    </>
  );
}
