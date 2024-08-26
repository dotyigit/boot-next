import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { session } = await validateRequest();

  if (session) {
    return redirect("/entries");
  }

  return <div>{children}</div>;
}
