import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to home page
  if (!user) {
    redirect("/");
  }

  // Fetch all user profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Error fetching profiles:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-gray-600">Browse all registered users and their profile information.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {!profiles || profiles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile.display_name || "No display name"}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>

                {profile.biography && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-700">Biography</h4>
                    <p className="text-sm leading-relaxed text-gray-600">{profile.biography}</p>
                  </div>
                )}

                {!profile.biography && <p className="text-sm italic text-gray-400">No biography provided</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {profiles?.length ?? 0} user{profiles?.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
