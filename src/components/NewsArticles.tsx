import React from 'react';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  snippet: string;
  image: string;
  author: string;
  date: string;
  category: string;
};

const articles: Article[] = [
  {
    id: '1',
    title: 'How to register property & handle stamp duty in Kolhapur 2026?',
    snippet: 'Complete step-by-step guide on registration fees, required documents, and online slot booking for Kolhapur buyers.',
    image: '/assets/images/property_1.png',
    author: 'Anuradha Ramamirtham',
    date: 'May 2026',
    category: 'Buying Guide'
  },
  {
    id: '2',
    title: 'Kolhapur Ring Road project: Proposed route details & market updates',
    snippet: 'An in-depth look at the upcoming Ring Road project, infrastructure developments, and how it impacts land rates.',
    image: '/assets/images/property_2.png',
    author: 'Harini Balasubramanian',
    date: 'Feb 2026',
    category: 'Market Trends'
  },
  {
    id: '3',
    title: 'Top 5 prime localities for high ROI investment in Kolhapur',
    snippet: 'Discover why Tarabai Park, Nagala Park, and Rajarampuri continue to lead real estate appreciation values.',
    image: '/assets/images/property_3.png',
    author: 'Aangan News Desk',
    date: 'Dec 2025',
    category: 'Insights'
  }
];

export default function NewsArticles() {
  return (
    <section className="news-section">
      <div className="section-header flex-between">
        <div>
          <h3>News and Articles</h3>
          <p>Read what's happening in Kolhapur Real Estate</p>
        </div>
        <Link href="/search" className="btn-outline btn-sm">See all news & articles →</Link>
      </div>

      <div className="news-grid">
        {articles.map((art) => (
          <article key={art.id} className="news-card">
            <div className="news-img-wrapper">
              <img src={art.image} alt={art.title} />
              <span className="news-cat-badge">{art.category}</span>
            </div>
            <div className="news-content">
              <h4>{art.title}</h4>
              <p>{art.snippet}</p>
              <div className="news-meta">
                <span className="author">{art.author}</span>
                <span className="dot">•</span>
                <span className="date">{art.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
