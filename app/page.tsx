import { logoutAction } from "@/actions/authentication";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return <h1>Hello random</h1>;

  return (
    <>
      <h1>Hello {session.user.name}</h1>
    </>
  );
}
