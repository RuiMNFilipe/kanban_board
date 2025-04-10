import getUserBoardsAction from "@/actions/getUserBoards";
import Link from "next/link";

export default async function BoardsPage() {
  const data = await getUserBoardsAction();

  if (!data) return <div>Error loading boards</div>;

  return (
    <div>
      <h1>{data?.name}'s Boards:</h1>
      <ul>
        {data.boards.map((board) => (
          <Link key={board.id} href={`/boards/${board.id}`}>
            <li key={board.id}>{board.name}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
