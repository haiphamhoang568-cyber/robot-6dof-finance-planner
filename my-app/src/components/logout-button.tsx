"use client";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Button } from "../../components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="shrink-0 rounded-full border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 hover:text-cyan-100"
    >
      Đăng xuất
    </Button>
  );
}
