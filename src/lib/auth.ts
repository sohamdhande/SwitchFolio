import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getOrCreateUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (dbUser) {
    return dbUser;
  }

  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) {
    throw new Error("No primary email address found for the user.");
  }

  const username = user.username || primaryEmail.split('@')[0];

  const newDbUser = await db.user.create({
    data: {
      clerkId: user.id,
      email: primaryEmail,
      username: username,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
    },
  });

  return newDbUser;
};
