import { fetchUserInfo } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Typography from "@mui/material/Typography";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  const user = await fetchUserInfo(session.user.id);

  return <Typography variant="h6">Welcome {user?.name}</Typography>;
}
