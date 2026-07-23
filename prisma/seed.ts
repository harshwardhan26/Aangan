import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Helper to get random item from array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a random number within a range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate realistic Indian currency string (e.g. ₹1.2 Cr, ₹85 L)
const formatPrice = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  return `₹${(num / 100000).toFixed(0)} L`;
};

async function main() {
  console.log(`Clearing existing properties...`)
  await prisma.property.deleteMany({});
  
  console.log(`Start seeding 50 random properties...`)
  
  const locations = [
    "Tarabai Park, Kolhapur",
    "Nagala Park, Kolhapur",
    "Rajarampuri, Kolhapur",
    "Pratibha Nagar, Kolhapur",
    "Kadamwadi, Kolhapur",
    "Shahupuri, Kolhapur",
    "Ruikar Colony, Kolhapur"
  ];
  
  const titlesPrefixes = ["Serene", "Azure", "Skyline", "Royal", "Emerald", "Golden", "Majestic", "Pristine", "Urban"];
  const titleTypes = ["Luxury Villa", "Cozy Apartment", "High-rise Residences", "Twin Bungalow", "Independent House", "Row House"];
  
  const badges = ["Verified", "Trending", "New Launch", "Ready to Move", "Best Seller"];
  
  // Create exactly the 3 hero images we have available
  const images = ["/assets/images/property_1.png", "/assets/images/property_2.png", "/assets/images/property_3.png"];
  
  const propertiesData = [];

  for (let i = 0; i < 50; i++) {
    // Generate realistic correlation between BHK, Area, and Price based on Kolhapur real estate
    const bedrooms = randomInt(1, 5);
    let areaSqft = 0;
    let ratePerSqft = 0;
    
    if (bedrooms === 1) {
      areaSqft = randomInt(500, 700);
      ratePerSqft = randomInt(4000, 5500);
    } else if (bedrooms === 2) {
      areaSqft = randomInt(900, 1300);
      ratePerSqft = randomInt(4500, 6000);
    } else if (bedrooms === 3) {
      areaSqft = randomInt(1400, 2200);
      ratePerSqft = randomInt(5500, 7500);
    } else { // 4 or 5 BHK (Villas/Bungalows)
      areaSqft = randomInt(2500, 5000);
      ratePerSqft = randomInt(7000, 12000);
    }
    
    const price = areaSqft * ratePerSqft;
    
    propertiesData.push({
      title: `${randomItem(titlesPrefixes)} ${randomItem(titleTypes)}`,
      price: price,
      displayPrice: formatPrice(price),
      location: randomItem(locations),
      bedrooms: bedrooms,
      areaSqft: areaSqft,
      imageUrl: randomItem(images),
      badge: Math.random() > 0.3 ? randomItem(badges) : null // 30% chance of no badge
    });
  }

  for (const p of propertiesData) {
    await prisma.property.create({
      data: p,
    });
  }
  
  console.log(`Seeding finished. 50 properties created.`)
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
