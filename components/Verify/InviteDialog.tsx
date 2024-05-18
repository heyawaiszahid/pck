"use client";

import { acceptInvite, declineInvite } from "@/app/actions";
import { verifyInviteSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function InviteDialog({
  id,
  firstName,
  email,
  companyName,
}: {
  id: string;
  firstName: string;
  email: string;
  companyName: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm({
    resolver: zodResolver(verifyInviteSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const doSubmit = async (formData: any) => {
    setLoading(true);

    const { password } = formData;
    const response = await acceptInvite({
      id,
      password,
    });

    setLoading(false);

    if (response.success) {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    }
  };

  const decline = async () => {
    await declineInvite(id);
    router.push("/");
  };

  return (
    <Dialog open={true}>
      <form noValidate onSubmit={handleSubmit((data) => doSubmit(data))}>
        <DialogTitle>Welcome {firstName}!</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            {companyName} invited you to join their team at Pipeline Conversion Kit. Please set up a password for your
            account and click the accept button.
          </DialogContentText>

          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <TextField
                {...field}
                inputRef={ref}
                fullWidth
                variant="standard"
                margin="dense"
                label="Password"
                type="password"
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                autoFocus
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
                variant="standard"
                margin="dense"
                label="Confirm Password"
                type="password"
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={decline}>Decline</Button>

          <Button type="submit" disabled={isLoading}>
            Accept
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
