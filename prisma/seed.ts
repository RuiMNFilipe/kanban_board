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
      boards: {
        create: [
          {
            name: "Alice's Board 1",
            tasks: {
              create: [
                {
                  title: "Random Thing 1",
                  status: "TODO",
                },
                {
                  title: "Random Thing 2",
                  status: "IN_PROGRESS",
                },
                {
                  title: "Random Thing 3",
                  status: "DONE",
                },
              ],
            },
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
      boards: {
        create: [
          {
            name: "Bob's Board 1",
            tasks: {
              create: [
                {
                  title: "Bob's Random Task 1",
                  status: "TODO",
                },
                {
                  title: "Bob's Random Task 2",
                  status: "TODO",
                },
                {
                  title: "Bob's Random Task 3",
                  status: "IN_PROGRESS",
                },
              ],
            },
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
