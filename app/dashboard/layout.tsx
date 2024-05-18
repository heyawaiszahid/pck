import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Copyright from "@/components/Copyright";
import AppBarDrawer from "@/components/Dashboard/Layout/AppBarDrawer";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBarDrawer role={user?.role} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          bgcolor: "dashboardMainBg",
        }}
      >
        <Toolbar />

        <Container maxWidth="lg" sx={{ p: 4 }}>
          {children}
          <Copyright />
        </Container>
      </Box>
    </Box>
  );
}
