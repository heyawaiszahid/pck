import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckIcon from "@mui/icons-material/Check";
import UserMenu from "@/components/UserMenu";
import { modules } from "@/config";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Link, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { blue } from "@mui/material/colors";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchUserInfo } from "./actions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const user = session ? await fetchUserInfo(session.user.id) : null;

  if (user?.role === "SUPERADMIN") return redirect("/dashboard");

  return (
    <>
      <Box sx={{ position: "fixed", top: 0, right: 0, px: 3, py: 1.5 }}>
        {!user && (
          <Box display="flex" gap={3}>
            <Link href="/signup" color="white" underline="hover">
              Sign Up
            </Link>
            <Link href="/signin" color="white" underline="hover">
              Sign In
            </Link>
          </Box>
        )}

        {user && <UserMenu {...user} />}
      </Box>

      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundImage: "url(/images/home/background.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: blue[800],
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="start"
        gap={9}
        py={9}
      >
        <Image src="images/logo.svg" width={300} height={105} alt="" priority={true} />

        <nav style={{ width: "100%", maxWidth: 440 }}>
          <List sx={{ color: "white", "& .MuiListItemText-primary": { fontSize: 20 } }}>
            {modules.map((module, index) => {
              const { title, isActive, isPaid } = module;
              const href = title.toLowerCase().replaceAll(" ", "-");
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton component={Link} href={href} disabled={isActive === false}>
                    <ListItemText primary={title} />
                    {!isPaid && <CheckIcon />}
                    {isPaid && user && <CheckIcon />}
                    {isPaid && !user && <LockIcon />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>
    </>
  );
}
