import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DiscoveryFrameworkCompany from "@/components/Dashboard/Settings/Company/DiscoveryFramework";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsCompanyDiscoveryFramework() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  if (user?.role !== "SUPERADMIN") return redirect("/dashboard");

  const companiesRequest = await fetch(`${process.env.NEXTAUTH_URL}/api/company`);
  const companies = await companiesRequest.json();

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Box>
        <Typography variant="h6">Discovery Framework</Typography>
        <Typography variant="body2">
          Configure the discovery framework for a company by choosing its name from the dropdown box below.
        </Typography>
      </Box>

      <DiscoveryFrameworkCompany companies={companies} />
    </Box>
  );
}
