const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);
  const views = await prisma.view.findMany();
  console.log("Views:", views);
}

main().catch(console.error).finally(() => prisma.$disconnect());
