import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IntakeForm from "@/components/Dashboard/Settings/DiscoveryFramework/IntakeForm";
import DiscoveryFramework from "@/components/DiscoveryFramework/DiscoveryFramework";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DiscoveryFrameworkSettings() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  if (user?.role === "SUPERADMIN") return redirect("/dashboard");

  const { role, profile } = user!;

  const requestCompanyDetails = await fetch(`${process.env.NEXTAUTH_URL}/api/company/${user?.company?.id}`, {
    next: { tags: ["companyDetails"] },
  });
  const companyDetails = await requestCompanyDetails.json();
  const { logo, primaryColor, secondaryColor, modules } = companyDetails;

  const companyDiscoveryFramework = modules.filter((module: any) => module.title === "Discovery Framework")[0];
  const { subscription } = companyDiscoveryFramework;

  let data = null;

  if (subscription === "new") {
    if (role === "ADMIN")
      return (
        <Box display="flex" flexDirection="column" gap={5}>
          <Box>
            <Typography variant="h6">Discovery Framework</Typography>
            <Typography variant="body2">
              Take the first step by filling out the form below. Our experts will personalize the discovery framework to
              perfectly match your niche.
            </Typography>
          </Box>

          <IntakeForm id={companyDetails.id} />
        </Box>
      );

    if (role === "USER")
      return (
        <Box>
          <Typography variant="h6">Discovery Framework</Typography>
          <Typography variant="body2">
            To initiate your access to the discovery framework, kindly ensure that your company submits the necessary
            intake form.
          </Typography>
        </Box>
      );
  }

  if (subscription === "pending") {
    if (role === "ADMIN")
      return (
        <Box>
          <Typography variant="h6">Discovery Framework</Typography>
          <Typography variant="body2">
            Your application is currently undergoing review. Our experts are configuring the discovery framework for
            you.
          </Typography>
          <Typography variant="body2">Please check back within the next 24 hours for further updates.</Typography>
        </Box>
      );

    if (role === "USER")
      return (
        <Box>
          <Typography variant="h6">Discovery Framework</Typography>
          <Typography variant="body2">
            Your {"company's"} application is currently undergoing review. Our experts are configuring the discovery
            framework for you.
          </Typography>
          <Typography variant="body2">Please check back within the next 24 hours for further updates.</Typography>
        </Box>
      );
  }

  if (subscription === "active") {
    const userModules = profile?.modules! as any[];
    const userDiscoveryFramework = userModules.filter((module: any) => module.title === "Discovery Framework")[0];

    if (!userDiscoveryFramework || !userDiscoveryFramework.isActive) {
      return (
        <Box>
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You do not have the necessary permissions to access this page. Please contact your system administrator for
            assistance.
          </Typography>
        </Box>
      );
    }

    data = {
      logo,
      primaryColor,
      secondaryColor,
      company: companyDiscoveryFramework.data.default,
      user: userDiscoveryFramework.data,
      userId: user?.id,
    };

    return (
      <Box display="flex" flexDirection="column" gap={5}>
        <Box>
          <Typography variant="h6">Discovery Framework</Typography>
          <Typography variant="body2">
            Customize your discovery framework to meet your {"clients'"} specific needs.
          </Typography>
        </Box>

        <DiscoveryFramework data={data} editMode={true} />
      </Box>
    );
  }
}
