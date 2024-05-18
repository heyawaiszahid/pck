"use client";

import { signUpSchema } from "@/app/schema";
import { modules } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Copyright from "./Copyright";
import Snackbar from "./Snackbar";

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      companyName: "",
      companyLogo: undefined,
      primaryColor: "#ffffff",
      secondaryColor: "#ffffff",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    title: "",
    message: "",
  });

  async function doSignUp(formData: any) {
    const logo = formData.companyLogo as File;
    const filename = `${Date.now()}.${logo.name.split(".").pop()}`;
    formData.companyLogo = filename;

    const _modules: any[] = modules.filter((module) => module.isActive && module.isPaid);
    _modules.map((_module) => {
      _module.subscription = "new";
      _module["data"] = {
        answers: null,
        default: null,
      };
    });
    formData.modules = _modules;

    setIsLoading(true);

    const request = await fetch("/api/company", {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await request.json();

    if (response.error) {
      setIsLoading(false);
      const { title, message } = response;
      setSnackbarProps({ open: true, title, message });
      return;
    }

    const body = new FormData();
    body.append("image", logo);
    body.append("filename", filename);
    await fetch("/api/image", {
      method: "POST",
      body,
    });

    const { email, password } = formData;

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
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
        Sign up
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit((fd) => doSignUp(fd))} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="firstname"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  margin="normal"
                  label="First Name"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="lastname"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            />
          </Grid>
        </Grid>

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

        <Controller
          name="companyName"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              inputRef={ref}
              fullWidth
              margin="normal"
              label="Company Name"
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
            />
          )}
        />

        <Controller
          name="companyLogo"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <MuiFileInput
              {...field}
              inputRef={ref}
              fullWidth
              margin="normal"
              label="Company Logo"
              error={!!error}
              helperText={error?.message}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/*" }}
              hideSizeText
            />
          )}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="primaryColor"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <MuiColorInput
                  {...field}
                  inputRef={ref}
                  format="hex"
                  isAlphaHidden
                  label="Primary Color"
                  margin="normal"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="secondaryColor"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <MuiColorInput
                  {...field}
                  inputRef={ref}
                  format="hex"
                  isAlphaHidden
                  label="Secondary Color"
                  margin="normal"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          Sign Up
        </Button>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>

        <Copyright />
      </Box>

      <Snackbar {...snackbarProps} onClose={() => setSnackbarProps({ ...snackbarProps, open: false })} />
    </Box>
  );
}
