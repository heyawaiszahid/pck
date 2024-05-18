"use client";

import { signInSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Copyright from "./Copyright";
import Snackbar from "./Snackbar";

export default function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    title: "",
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const router = useRouter();

  async function doSignIn(formData: any) {
    setIsLoading(true);
    const auth = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (auth?.error) {
      setIsLoading(false);
      const { title, message } = JSON.parse(auth.error);
      setSnackbarProps({ open: true, title, message });
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit((fd) => doSignIn(fd))} sx={{ mt: 1 }}>
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              inputRef={ref}
              fullWidth
              margin="normal"
              label="Email Address"
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              inputRef={ref}
              fullWidth
              margin="normal"
              label="Password"
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              type="password"
            />
          )}
        />

        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          Sign In
        </Button>

        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>

          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>

        <Copyright />
      </Box>

      <Snackbar {...snackbarProps} onClose={() => setSnackbarProps({ ...snackbarProps, open: false })} />
    </Box>
  );
}
