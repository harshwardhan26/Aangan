const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const url = './prisma/dev.db'; // stripped 'file:'
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ take: 1 });
  console.log("Users:", users.length);
}
main().catch(console.error);
