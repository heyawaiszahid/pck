import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddButton from "@/components/Dashboard/Members/AddButton";
import MembersTable from "@/components/Dashboard/Members/MembersTable";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Members() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  if (user?.role !== "ADMIN") return redirect("/dashboard");

  const companyDetailsRequest = await fetch(`${process.env.NEXTAUTH_URL}/api/company/${user?.company?.id}`, {
    next: { tags: ["companyDetails"] },
  });
  const companyDetails = await companyDetailsRequest.json();

  const { id, name, modules, users } = companyDetails;

  const _modules = modules.map((module: any) => {
    return { title: module.title, isActive: module.isActive };
  });

  return (
    <>
      <Box display="flex" alignItems="center" sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h6">Manage Members</Typography>
          <Typography variant="body2">Invite others and give them access to areas relevant to their work.</Typography>
        </Box>
        <AddButton company={{ id, name, modules: _modules }} />
      </Box>

      <MembersTable users={users} />
    </>
  );
}
