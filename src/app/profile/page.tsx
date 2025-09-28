"use client";

import { useUserStore } from "@/utils/store/userStore";
import { useRouter } from "next/navigation";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  if (!user) return <p>Not logged in</p>;

  const handleLogout = async () => {
    await logout();
    router.push("/login"); // ✅ redirect after logout
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome {user.name || user.email}</h1>
      <p>Email: {user.email}</p>
      <p>Location: {user.location ?? "N/A"}</p>

      <button
        onClick={handleLogout}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
