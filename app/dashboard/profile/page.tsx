import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditForm from "@/components/Dashboard/Profile/EditForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  if (user?.role === "SUPERADMIN") return redirect("/dashboard");

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6">Edit Profile</Typography>
        <Typography variant="body2">
          {user?.role === "ADMIN"
            ? "Manage your personal and company information in one place."
            : "Manage your personal information or update your password."}
        </Typography>
      </Box>

      <EditForm user={user} />
    </Box>
  );
}
