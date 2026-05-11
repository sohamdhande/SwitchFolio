const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", JSON.stringify(users, null, 2));
  const views = await prisma.view.findMany();
  console.log("Views:", JSON.stringify(views, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
