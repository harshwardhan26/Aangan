import React from 'react';
import Link from 'next/link';

export default function EmptyState({
  title,
  description,
  actionText,
  actionLink,
  icon,
}: {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        {icon || (
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      
      {actionText && actionLink && (
        <Link href={actionLink} className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          {actionText}
        </Link>
      )}
    </div>
  );
}
