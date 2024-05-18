"use client";

import { addAndInvite } from "@/app/actions";
import { addMemberSchema } from "@/app/schema";
import Snackbar from "@/components/Snackbar";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AlertColor, Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

interface Company {
  id: string;
  name: string;
  modules: any[];
}

export default function AddButton({ company }: { company: Company }) {
  const [modules, updateModules] = useState(company.modules);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleSwitchToggle = (title: string) => {
    updateModules((prevModules) =>
      prevModules.map((module) => (module.title === title ? { ...module, isActive: !module.isActive } : module))
    );
  };

  const [isPending, startTransition] = useTransition();

  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error" as AlertColor,
    title: "",
    message: "",
  });

  const pushData = (formData: any) => {
    const { name, email } = formData;

    const userModules: any = [];
    modules.map((module) => {
      userModules.push({
        title: module.title,
        isActive: module.isActive,
        data: null,
      });
    });

    startTransition(async () => {
      const response = await addAndInvite({
        name,
        email,
        modules: userModules,
        companyId: company.id,
        companyName: company.name,
      });

      const { success, title, message } = response;

      setSnackbarProps({ open: true, severity: success ? "success" : "error", title, message });

      if (success) handleClose();
    });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ ml: "auto", flexShrink: 0 }}
        startIcon={<PersonAddIcon />}
        onClick={handleClickOpen}
      >
        Add New
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        TransitionProps={{
          onExited: () => {
            reset();
          },
        }}
      >
        <form noValidate onSubmit={handleSubmit((data) => pushData(data))}>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogContent>
            <DialogContentText marginBottom={1} fontWeight={500}>
              Members can have different levels of access corresponding to the modules you choose below.
            </DialogContentText>

            <Controller
              name="name"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  fullWidth
                  variant="standard"
                  margin="dense"
                  label="Name"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  autoFocus
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
                  variant="standard"
                  margin="dense"
                  label="Email Address"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Box display="flex" flexDirection="column">
              <Typography component="p" variant="overline">
                Modules
              </Typography>

              {modules.map((module: any, index: number) => {
                const { title, isActive } = module;
                return (
                  <FormControlLabel
                    key={index}
                    sx={{ display: "flex", justifyContent: "space-between", ml: 0 }}
                    control={<Switch checked={isActive} onChange={() => handleSwitchToggle(title)} />}
                    label={title}
                    labelPlacement="start"
                  />
                );
              })}
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <Button type="submit" disabled={isPending}>
              Invite
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar {...snackbarProps} onClose={() => setSnackbarProps({ ...snackbarProps, open: false })} />
    </>
  );
}
