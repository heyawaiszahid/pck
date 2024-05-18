"use client";

import { Alert, AlertColor, AlertTitle, Snackbar as MuiSnackbar, Paper } from "@mui/material";

interface Props {
  open: boolean;
  severity?: AlertColor | "error";
  title: string;
  message: string;
  onClose?: () => void;
}

export default function Snackbar(props: Props) {
  const { open, severity, title, message, onClose } = props;

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity={(severity as AlertColor) || "error"}
        sx={{ maxWidth: "500px" }}
        component={Paper}
        elevation={4}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
