import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CompaniesTable from "@/components/Dashboard/Companies/CompaniesTable";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Companies() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  if (user?.role !== "SUPERADMIN") return redirect("/dashboard");

  const companiesRequest = await fetch(`${process.env.NEXTAUTH_URL}/api/company`);
  const companies = await companiesRequest.json();

  return (
    <>
      <Box mb={5}>
        <Typography variant="h6">Companies</Typography>
        <Typography variant="body2">Comprehensive insights into all registered companies and their members.</Typography>
      </Box>

      <CompaniesTable companies={companies} />
    </>
  );
}
