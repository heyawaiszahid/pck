import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignUpForm from "@/components/SignUpForm";
import { Grid, Paper } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignUp() {
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
          backgroundImage: "url(/images/signup/background.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <SignUpForm />
      </Grid>
    </Grid>
  );
}
