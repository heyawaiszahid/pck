import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DiscoveryFramework from "@/components/DiscoveryFramework/DiscoveryFramework";
import { Box, Link, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DiscoveryFrameworkPage() {
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

  if (subscription === "new") {
    if (role === "ADMIN") {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" mb={1}>
            Activation Required
          </Typography>
          <Typography variant="body2">
            To initiate your access to the discovery framework, kindly submit the intake form{" "}
            <Link href="/dashboard/settings/discovery-framework">here</Link>.
          </Typography>
        </Box>
      );
    }

    if (role === "USER") {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" mb={1}>
            Activation Required
          </Typography>
          <Typography variant="body2" mb={4}>
            To initiate your access to the discovery framework, kindly ensure that your company submits the necessary
            intake form.
          </Typography>
          <Typography variant="body2">
            <Link href="/">Go Back</Link>
          </Typography>
        </Box>
      );
    }
  }

  if (subscription === "pending") {
    if (role === "ADMIN") {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" mb={1}>
            Application Under Review
          </Typography>
          <Typography variant="body2">
            Your application is under review, and one of our experts is currently configuring the discovery framework
            specifically for you.
          </Typography>
          <Typography variant="body2" mb={4}>
            Kindly check back within the next 24 hours for further updates.
          </Typography>
          <Typography variant="body2">
            <Link href="/">Go Back</Link>
          </Typography>
        </Box>
      );
    }

    if (role === "USER") {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" mb={1}>
            Application Under Review
          </Typography>
          <Typography variant="body2">
            Your {"comapny's"} application is under review, and one of our experts is currently configuring the
            discovery framework specifically for you.
          </Typography>
          <Typography variant="body2" mb={4}>
            Kindly check back within the next 24 hours for further updates.
          </Typography>
          <Typography variant="body2">
            <Link href="/">Go Back</Link>
          </Typography>
        </Box>
      );
    }
  }

  let data = null;

  if (subscription === "active") {
    const userModules = profile?.modules! as any[];
    const userDiscoveryFramework = userModules.filter((module: any) => module.title === "Discovery Framework")[0];

    if (!userDiscoveryFramework || !userDiscoveryFramework.isActive) {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" mb={1}>
            Access Denied
          </Typography>
          <Typography variant="body2" mb={4}>
            You do not have the necessary permissions to access this page. Please contact your system administrator for
            assistance
          </Typography>
          <Typography variant="body2">
            <Link href="/">Go Back</Link>
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
  }

  return <DiscoveryFramework data={data} />;
}
