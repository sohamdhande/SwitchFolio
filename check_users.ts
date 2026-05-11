import { db } from './src/lib/db';

async function main() {
  const users = await db.user.findMany();
  console.log("Users:", users);
  const views = await db.view.findMany();
  console.log("Views:", views);
}

main().catch(console.error).finally(() => db.$disconnect());
