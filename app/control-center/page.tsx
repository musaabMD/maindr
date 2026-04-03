import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/control-center/admin-console";

const ADMIN_EMAIL = "mousab.r@gmail.com";

export default async function ControlCenterPage() {
  const user = await currentUser();
  const hasAdminEmail = Boolean(
    user?.emailAddresses?.some(
      (email) => email.emailAddress.toLowerCase() === ADMIN_EMAIL,
    ),
  );

  if (!hasAdminEmail) {
    notFound();
  }

  return <AdminConsole />;
}
