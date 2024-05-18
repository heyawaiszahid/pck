import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "@/components/SignInForm";
import { Grid, Paper } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/images/signin/background.jpeg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <SignInForm />
      </Grid>
    </Grid>
  );
}
