import { hashAndSaltPw } from "../utils/password";
import { Board, Column, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const getColumnCategory = (columns: Column[], category: string) => {
    return columns.find((col) => col.name === category);
  };

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
          },
        ],
      },
    },
  });

  const aliceBoard = await prisma.board.findFirst({
    where: {
      userId: alice.id,
    },
  });

  if (aliceBoard) {
    await prisma.column.createMany({
      data: [
        {
          name: "Todo",
          boardId: aliceBoard.id,
        },
        {
          name: "In Progress",
          boardId: aliceBoard.id,
        },
        {
          name: "Done",
          boardId: aliceBoard.id,
        },
      ],
    });

    const columns: Column[] = await prisma.column.findMany({
      where: {
        boardId: aliceBoard.id,
      },
    });

    const todoColumn = getColumnCategory(columns, "Todo");
    const inProgressColumn = getColumnCategory(columns, "In Progress");
    const doneColumn = getColumnCategory(columns, "Done");

    if (todoColumn && inProgressColumn && doneColumn) {
      await prisma.task.createMany({
        data: [
          {
            title: "Task 1 for Alice",
            boardId: aliceBoard.id,
            columnId: todoColumn.id,
            position: 1,
          },
          {
            title: "Task 2 for Alice",
            boardId: aliceBoard.id,
            columnId: inProgressColumn.id,
            position: 1,
          },
          {
            title: "Task 3 for Alice",
            boardId: aliceBoard.id,
            columnId: doneColumn.id,
            position: 1,
          },
          {
            title: "Task 4 for Alice",
            boardId: aliceBoard.id,
            columnId: todoColumn.id,
            position: 2,
          },
        ],
      });
    } else {
      console.error("One or more columns not found.");
    }
  } else {
    console.error("Alice's board not found.");
  }

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
          },
        ],
      },
    },
  });

  const bobBoard = await prisma.board.findFirst({
    where: {
      userId: bob.id,
    },
  });

  if (bobBoard) {
    await prisma.column.createMany({
      data: [
        {
          name: "Todo",
          boardId: bobBoard.id,
        },
        {
          name: "In Progress",
          boardId: bobBoard.id,
        },
        {
          name: "Done",
          boardId: bobBoard.id,
        },
      ],
    });

    const columns: Column[] = await prisma.column.findMany({
      where: {
        boardId: bobBoard.id,
      },
    });

    const todoColumn = getColumnCategory(columns, "Todo");
    const inProgressColumn = getColumnCategory(columns, "In Progress");
    const doneColumn = getColumnCategory(columns, "Done");

    if (todoColumn && inProgressColumn && doneColumn) {
      await prisma.task.createMany({
        data: [
          {
            title: "Task 1 for Bob",
            boardId: bobBoard.id,
            columnId: todoColumn.id,
            position: 1,
          },
          {
            title: "Task 2 for Bob",
            boardId: bobBoard.id,
            columnId: inProgressColumn.id,
            position: 1,
          },
          {
            title: "Task 3 for Bob",
            boardId: bobBoard.id,
            columnId: doneColumn.id,
            position: 1,
          },
          {
            title: "Task 4 for Bob",
            boardId: bobBoard.id,
            columnId: todoColumn.id,
            position: 2,
          },
        ],
      });
    } else {
      console.error("One or more columns not found.");
    }
  } else {
    console.error("Bob's board not found.");
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
