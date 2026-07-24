import Navbar from '@/components/Navbar';
import HeroCalculator from '@/components/HeroCalculator';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import RecommendedSellers from '@/components/RecommendedSellers';
import SellPropertyBanner from '@/components/SellPropertyBanner';
import NewsArticles from '@/components/NewsArticles';
import PopularSearches from '@/components/PopularSearches';
import Footer from '@/components/Footer';
import { getProperties } from '@/actions/properties';

export const metadata = {
  title: 'Aangan | Properties to Buy, Rent & Sell in Kolhapur',
  description: 'Step into your own Aangan — Search verified flats, luxury villas, and plots in Kolhapur with smart budget tools.',
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialProperties = await getProperties({ skip: 0, take: 8 });

  return (
    <>
      <Navbar />
      <HeroCalculator />
      <FeaturedProperties initialProperties={initialProperties} />
      <RecommendedSellers />
      <SellPropertyBanner />
      <Services />
      <NewsArticles />
      <PopularSearches />
      <Footer />
    </>
  );
}
