import Link from "next/link";
import RecipeList from "~/app/_components/RecipeList";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#f5f6f8', padding: '20px' }}>
        <div className="text-center">
          <p className="text-2xl" style={{ color: '#243642' }}>
            {session ? (
              <span>Logged in as {session.user?.name}</span>
            ) : (
              "Welcome! Please sign in."
            )}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="mt-5 rounded-full px-10 py-3 font-semibold no-underline transition bg-white/40 hover:bg-white/50"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>

        {session?.user && <RecipeList />}
      </main>
    </HydrateClient>
  );
}
