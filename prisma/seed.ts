import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const properties = [
  {
    title: "Luxurious 3 BHK Apartment in Tarabai Park",
    price: 12500000,
    displayPrice: "₹1.25 Cr",
    location: "Tarabai Park, Kolhapur",
    bedrooms: 3,
    areaSqft: 1850,
    imageUrl: "/assets/images/property_1.png",
    badge: "Verified",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Experience premium living in the heart of Tarabai Park. This east-facing 3 BHK apartment offers top-notch amenities, modular kitchen, and reserved covered parking."
  },
  {
    title: "Elegant 4 BHK Independent Villa",
    price: 35000000,
    displayPrice: "₹3.50 Cr",
    location: "Nagala Park, Kolhapur",
    bedrooms: 4,
    areaSqft: 3200,
    imageUrl: "/assets/images/property_2.png",
    badge: "Premium",
    propertyType: "Independent Villa/House",
    purpose: "sell",
    description: "A stunning independent villa featuring modern architecture, a private garden, and spacious living areas. Perfect for families looking for luxury and privacy in Nagala Park."
  },
  {
    title: "Spacious 2 BHK Flat for Family",
    price: 6500000,
    displayPrice: "₹65 L",
    location: "Rajarampuri, Kolhapur",
    bedrooms: 2,
    areaSqft: 1100,
    imageUrl: "/assets/images/property_3.png",
    badge: "Best Seller",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Well-maintained 2 BHK apartment located in the bustling area of Rajarampuri. Close to major schools, hospitals, and shopping centers. Excellent cross ventilation."
  },
  {
    title: "Prime Residential Plot",
    price: 8000000,
    displayPrice: "₹80 L",
    location: "Shahupuri, Kolhapur",
    bedrooms: 0,
    areaSqft: 2000,
    imageUrl: "/assets/images/property_1.png",
    badge: "Hot Deal",
    propertyType: "Residential Plot/Land",
    purpose: "sell",
    description: "Clear-title residential plot in the highly sought-after Shahupuri locality. Ready for construction with all major utility connections available on site."
  },
  {
    title: "Modern Row House with Terrace",
    price: 11000000,
    displayPrice: "₹1.10 Cr",
    location: "Pratibha Nagar, Kolhapur",
    bedrooms: 3,
    areaSqft: 1600,
    imageUrl: "/assets/images/property_2.png",
    badge: "Ready to Move",
    propertyType: "Row House/Bungalow",
    purpose: "sell",
    description: "Beautifully designed 3 BHK row house featuring an open terrace, premium fittings, and vaastu compliance. Located in a peaceful and secure neighborhood."
  },
  {
    title: "Premium 3 BHK Flat overlooking Garden",
    price: 9500000,
    displayPrice: "₹95 L",
    location: "Ruikar Colony, Kolhapur",
    bedrooms: 3,
    areaSqft: 1550,
    imageUrl: "/assets/images/property_3.png",
    badge: "Verified",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Move-in ready 3 BHK offering a stunning view of the colony garden. Includes two balconies, spacious master bedroom, and 24/7 security."
  },
  {
    title: "Heritage Style 5 BHK Bungalow",
    price: 42000000,
    displayPrice: "₹4.20 Cr",
    location: "Shalini Palace, Kolhapur",
    bedrooms: 5,
    areaSqft: 4500,
    imageUrl: "/assets/images/property_1.png",
    badge: "Exclusive",
    propertyType: "Row House/Bungalow",
    purpose: "sell",
    description: "An exclusive heritage-style bungalow near Shalini Palace. Boasts double-height ceilings, a private courtyard, and ultra-luxurious interiors."
  },
  {
    title: "Cozy 1 BHK Starter Home",
    price: 3200000,
    displayPrice: "₹32 L",
    location: "Padmaraje Park, Kolhapur",
    bedrooms: 1,
    areaSqft: 650,
    imageUrl: "/assets/images/property_2.png",
    badge: null,
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Perfect starter home or investment property. This 1 BHK flat is smartly designed for space efficiency and is located in a quiet residential lane."
  },
  {
    title: "Spacious Corner Plot",
    price: 15000000,
    displayPrice: "₹1.50 Cr",
    location: "Kadamwadi, Kolhapur",
    bedrooms: 0,
    areaSqft: 3500,
    imageUrl: "/assets/images/property_3.png",
    badge: "New Launch",
    propertyType: "Residential Plot/Land",
    purpose: "sell",
    description: "Large corner plot with dual road access in a rapidly developing area of Kadamwadi. Ideal for constructing a spacious independent bungalow."
  },
  {
    title: "Lakeview 4 BHK Apartment",
    price: 21000000,
    displayPrice: "₹2.10 Cr",
    location: "Tarabai Park, Kolhapur",
    bedrooms: 4,
    areaSqft: 2400,
    imageUrl: "/assets/images/property_1.png",
    badge: "Trending",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Ultra-modern 4 BHK apartment with panoramic views of the city. Features smart home automation, imported marble flooring, and access to a clubhouse."
  },
  {
    title: "Affordable 2 BHK Row House",
    price: 5500000,
    displayPrice: "₹55 L",
    location: "Kadamwadi, Kolhapur",
    bedrooms: 2,
    areaSqft: 1000,
    imageUrl: "/assets/images/property_2.png",
    badge: null,
    propertyType: "Row House/Bungalow",
    purpose: "sell",
    description: "Budget-friendly 2 BHK row house with a private car park and small backyard. Located conveniently near public transport and daily markets."
  },
  {
    title: "Luxurious 3 BHK Penthouse",
    price: 18500000,
    displayPrice: "₹1.85 Cr",
    location: "Nagala Park, Kolhapur",
    bedrooms: 3,
    areaSqft: 2100,
    imageUrl: "/assets/images/property_3.png",
    badge: "Verified",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Stunning penthouse with a private terrace garden. Enjoy exclusive amenities, privacy, and an unhindered breeze in the prestigious Nagala Park."
  },
  {
    title: "Semi-furnished 2 BHK Flat",
    price: 4800000,
    displayPrice: "₹48 L",
    location: "Shahupuri, Kolhapur",
    bedrooms: 2,
    areaSqft: 950,
    imageUrl: "/assets/images/property_1.png",
    badge: "Ready to Move",
    propertyType: "Apartment/Flat",
    purpose: "sell",
    description: "Excellent condition 2 BHK flat that comes semi-furnished with wardrobes and kitchen cabinets. Located in the commercial hub for easy commutes."
  },
  {
    title: "East-facing Residential Plot",
    price: 6000000,
    displayPrice: "₹60 L",
    location: "Pratibha Nagar, Kolhapur",
    bedrooms: 0,
    areaSqft: 1500,
    imageUrl: "/assets/images/property_2.png",
    badge: null,
    propertyType: "Residential Plot/Land",
    purpose: "sell",
    description: "100% Vaastu compliant, east-facing plot in a fully developed gated community. Bank loan approved and ready for immediate registration."
  },
  {
    title: "Grand 4 BHK Row House",
    price: 14500000,
    displayPrice: "₹1.45 Cr",
    location: "Rajarampuri, Kolhapur",
    bedrooms: 4,
    areaSqft: 2000,
    imageUrl: "/assets/images/property_3.png",
    badge: "Verified",
    propertyType: "Row House/Bungalow",
    purpose: "sell",
    description: "Spacious multi-level row house perfect for a large family. Features multiple balconies, a dedicated study room, and covered parking for two cars."
  }
];

async function main() {
  console.log(`Clearing existing properties...`)
  await prisma.property.deleteMany({});
  
  console.log(`Start seeding 15 realistic properties...`)
  
  for (const p of properties) {
    await prisma.property.create({
      data: p,
    });
  }
  
  console.log(`Seeding finished. 15 properties created.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
