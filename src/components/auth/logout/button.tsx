"use client";
import { logoutAction } from "./actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
export function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>;
}
