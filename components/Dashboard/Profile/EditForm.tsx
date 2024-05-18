"use client";

import { updateProfile } from "@/app/actions";
import { companyInfoSchema, personalInfoSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Backdrop, Box, Button, Grid, Paper, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { MuiColorInput } from "mui-color-input";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function EditForm({ user }: { user: any }) {
  const { id, name, email, role, company } = user;

  const {
    control,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    resolver: zodResolver(role === "ADMIN" ? personalInfoSchema.and(companyInfoSchema) : personalInfoSchema),
    defaultValues: {
      name,
      email,
      password: "",
      confirmPassword: "",
      companyName: company.name,
      companyLogo: null as File | null,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSave = async (formData: any) => {
    startTransition(async () => {
      formData.id = id;
      formData.role = role;
      delete formData["confirmPassword"];

      if (role === "ADMIN") {
        if (company.logo !== formData.companyLogo.name) {
          const logo = formData.companyLogo as File;
          const filename = `${Date.now()}.${logo.name.split(".").pop()}`;
          formData.companyLogo = filename;
          const body = new FormData();
          body.append("image", logo);
          body.append("filename", filename);
          await fetch("/api/image", {
            method: "POST",
            body,
          });
        } else {
          delete formData["companyLogo"];
        }
      }

      await updateProfile(formData);
    });
  };

  const handleDiscard = () => reset();

  useEffect(() => {
    reset({ ...user, companyLogo: new File([], user.company.logo) });
  }, [reset, user]);

  return (
    <Paper elevation={4} sx={{ p: 5 }}>
      <form noValidate onSubmit={handleSubmit((data) => handleSave(data))}>
        <Grid container spacing={5} sx={{ mb: 4 }}>
          <Grid item md={role === "ADMIN" ? 6 : 12}>
            <Typography variant="subtitle2" mb={2}>
              Personal Information
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  margin="normal"
                  label="Name"
                  error={!!error}
                  helperText={error?.message}
                  autoComplete="off"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  margin="normal"
                  label="Email"
                  error={!!error}
                  helperText={error?.message}
                  autoComplete="off"
                  disabled
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
                  label="New Password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                  autoComplete="off"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                  autoComplete="off"
                />
              )}
            />
          </Grid>

          {role === "ADMIN" && (
            <Grid item md={6}>
              <Typography variant="subtitle2" mb={2}>
                Company Information
              </Typography>

              <Controller
                name="companyName"
                control={control}
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    margin="normal"
                    label="Compnay Name"
                    error={!!error}
                    helperText={error?.message}
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
                    label="Logo"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ accept: "image/*" }}
                    hideSizeText
                  />
                )}
              />

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
                  />
                )}
              />

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
                  />
                )}
              />
            </Grid>
          )}
        </Grid>

        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={handleDiscard} disabled={isPending}>
            Discard
          </Button>

          <Button type="submit" variant="contained" disabled={isPending}>
            Save
          </Button>
        </Box>
      </form>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
