import { hashAndSaltPw } from "../utils/password";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@test.com" },
    update: {},
    create: {
      email: "alice@test.com",
      name: "Alice",
      password: hashAndSaltPw("alice"),
      tasks: {
        create: [
          {
            title: "Alice Task 1",
            status: "TODO",
          },
          {
            title: "Alice Task 2",
            status: "DONE",
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@test.com" },
    update: {},
    create: {
      email: "bob@test.com",
      name: "Bob",
      password: hashAndSaltPw("bob"),
      tasks: {
        create: [
          {
            title: "Bob Task 1",
            status: "IN_PROGRESS",
          },
          {
            title: "Bob Task 2",
            status: "DONE",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
