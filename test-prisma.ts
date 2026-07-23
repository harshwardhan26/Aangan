import prisma from './src/lib/prisma';
async function main() {
  console.log("Checking DB...");
  const users = await prisma.user.findMany({ take: 1 });
  console.log("Found:", users.length);
}
main().catch(console.error);
