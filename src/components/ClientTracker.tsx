'use client';

import React, { useState } from 'react';
import { updateLeadAction, deleteLeadAction } from '@/actions/leads';

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  stage: string;
  notes: string | null;
  followupDate: Date | null;
  clientBudget: number | null;
  property: {
    title: string;
    location: string;
    displayPrice: string;
    price: number;
    imageUrl: string;
  };
};

export default function ClientTracker({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filterStage, setFilterStage] = useState<string>('All');
  const [showOnlyMismatch, setShowOnlyMismatch] = useState<boolean>(false);

  const isBudgetMismatch = (lead: Lead) => {
    if (!lead.clientBudget || !lead.property.price) return false;
    const propertyPrice = lead.property.price;
    // Gap > 25% of property price
    return lead.clientBudget < (propertyPrice * 0.75);
  };

  const handleUpdate = async (id: string, updates: Partial<Lead>) => {
    // Optimistic UI
    setLeads(current => current.map(l => l.id === id ? { ...l, ...updates } : l));
    
    // API Call
    const res = await updateLeadAction(id, updates);
    if (!res.success) {
      alert("Failed to update lead: " + res.error);
      // Revert optimism if needed (simple reload or state revert)
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    setLeads(current => current.filter(l => l.id !== id));
    const res = await deleteLeadAction(id);
    if (!res.success) {
      alert("Failed to delete lead.");
    }
  };

  const activeCount = leads.filter(l => !l.stage.includes('Closed')).length;
  const mismatchCount = leads.filter(isBudgetMismatch).length;
  const followupCount = leads.filter(l => l.followupDate && new Date(l.followupDate) <= new Date() && !l.stage.includes('Closed')).length;
  const wonCount = leads.filter(l => l.stage === 'Closed - Won').length;

  const filteredLeads = leads.filter(l => {
    if (filterStage !== 'All' && l.stage !== filterStage) return false;
    if (showOnlyMismatch && !isBudgetMismatch(l)) return false;
    return true;
  }).sort((a, b) => {
    if (!a.followupDate && !b.followupDate) return 0;
    if (!a.followupDate) return 1;
    if (!b.followupDate) return -1;
    return new Date(a.followupDate).getTime() - new Date(b.followupDate).getTime();
  });

  return (
    <div className="client-tracker">
      {/* Stat Bar */}
      <div className="tracker-stats">
        <div className="stat-card">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: mismatchCount > 0 ? '#ef4444' : 'inherit' }}>{mismatchCount}</div>
          <div className="stat-label">Budget Mismatches</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: followupCount > 0 ? '#f59e0b' : 'inherit' }}>{followupCount}</div>
          <div className="stat-label">Due Follow-ups</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>{wonCount}</div>
          <div className="stat-label">Closed Won</div>
        </div>
      </div>

      {/* Filters */}
      <div className="tracker-filters">
        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="form-select">
          <option value="All">All Stages</option>
          <option value="New Lead">New Lead</option>
          <option value="Site Visit Done">Site Visit Done</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Closed - Won">Closed - Won</option>
          <option value="Closed - Lost">Closed - Lost</option>
        </select>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={showOnlyMismatch} 
            onChange={(e) => setShowOnlyMismatch(e.target.checked)} 
          />
          Only budget mismatches
        </label>
      </div>

      {/* List */}
      <div className="tracker-list">
        {filteredLeads.length === 0 ? (
          <div className="empty-state">No leads found matching criteria.</div>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead.id} className="tracker-card">
              <div className="card-header">
                <div className="buyer-info">
                  <h4>{lead.name}</h4>
                  <p>{lead.phone} {lead.email && `| ${lead.email}`}</p>
                </div>
                <div className="badge-container">
                  <span className={`source-badge ${lead.source === 'like' ? 'badge-like' : 'badge-contact'}`}>
                    {lead.source === 'like' ? '❤️ Saved Property' : '📩 Contact Request'}
                  </span>
                </div>
              </div>
              
              <div className="property-info">
                <strong>Interested in:</strong> {lead.property.title} ({lead.property.location})
                <br />
                <strong>Price:</strong> {lead.property.displayPrice}
                {lead.clientBudget ? (
                  <span className={`budget-info ${isBudgetMismatch(lead) ? 'text-danger' : 'text-success'}`}>
                    {' '} | <strong>Client Budget:</strong> ₹{(lead.clientBudget / 100000).toFixed(2)}L
                    {isBudgetMismatch(lead) && ' ⚠️ Gap > 25%'}
                  </span>
                ) : (
                  <span className="budget-info text-muted"> | No budget specified</span>
                )}
              </div>

              <div className="tracker-actions">
                <div className="action-group">
                  <label>Stage:</label>
                  <select 
                    value={lead.stage} 
                    onChange={(e) => handleUpdate(lead.id, { stage: e.target.value })}
                    className="form-select-small"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Site Visit Done">Site Visit Done</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Closed - Won">Closed - Won</option>
                    <option value="Closed - Lost">Closed - Lost</option>
                  </select>
                </div>
                
                <div className="action-group">
                  <label>Follow-up:</label>
                  <input 
                    type="date" 
                    value={lead.followupDate ? new Date(lead.followupDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdate(lead.id, { followupDate: e.target.value ? new Date(e.target.value) : null })}
                    className="form-input-small"
                  />
                </div>
              </div>

              <div className="action-group full-width mt-2">
                <textarea 
                  placeholder="Add notes..." 
                  value={lead.notes || ''}
                  onChange={(e) => handleUpdate(lead.id, { notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="card-footer">
                <button className="btn-delete" onClick={() => handleDelete(lead.id)}>Delete Lead</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .client-tracker { max-width: 1000px; margin: 0 auto; padding: 20px 0; }
        .tracker-stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
        .stat-card { flex: 1; min-width: 150px; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: 700; color: #0f172a; }
        .stat-label { font-size: 0.85rem; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px; }
        
        .tracker-filters { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #334155; font-weight: 500; }
        .form-select { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 14px; }
        
        .tracker-list { display: flex; flex-direction: column; gap: 20px; }
        .tracker-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .buyer-info h4 { margin: 0 0 5px 0; font-size: 1.1rem; color: #0f172a; }
        .buyer-info p { margin: 0; color: #64748b; font-size: 0.9rem; }
        
        .source-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .badge-contact { background: #dbeafe; color: #1e40af; }
        .badge-like { background: #fce7f3; color: #be185d; }
        
        .property-info { background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 0.9rem; border-left: 3px solid #cbd5e1; color: #334155; }
        .text-danger { color: #ef4444; }
        .text-success { color: #10b981; }
        .text-muted { color: #94a3b8; }
        
        .tracker-actions { display: flex; gap: 20px; flex-wrap: wrap; }
        .action-group { display: flex; flex-direction: column; gap: 5px; }
        .action-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
        .form-select-small, .form-input-small { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.9rem; width: 150px; background: #fff; }
        .form-textarea { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; min-height: 80px; resize: vertical; }
        .full-width { width: 100%; }
        
        .card-footer { display: flex; justify-content: flex-end; margin-top: 5px; }
        .btn-delete { background: none; border: none; color: #ef4444; font-size: 0.85rem; font-weight: 500; cursor: pointer; padding: 5px 10px; border-radius: 4px; transition: background 0.2s; }
        .btn-delete:hover { background: #fef2f2; }
        .empty-state { text-align: center; padding: 50px; color: #64748b; background: #fff; border-radius: 8px; border: 1px dashed #cbd5e1; font-weight: 500; }
      `}</style>
    </div>
  );
}
