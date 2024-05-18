"use client";

import { updateUser } from "@/app/actions";
import { editMemberSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function EditButton({ user }: { user: any }) {
  const { id, name, status, profile } = user;

  const [modules, updateModules] = useState(profile.modules as any[]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = async () => setOpen(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      name,
    },
  });

  const handleSwitchToggle = (title: string) => {
    updateModules((prevModules) =>
      prevModules.map((module) => (module.title === title ? { ...module, isActive: !module.isActive } : module))
    );
  };

  const [isPending, startTransition] = useTransition();

  const handleSave = (formData: any) => {
    const { name } = formData;

    startTransition(async () => {
      await updateUser({
        id,
        name,
        modules,
      });
      handleClose();
    });
  };

  useEffect(() => {
    reset(user);
  }, [reset, user]);

  return (
    <>
      <IconButton size="small" onClick={handleClickOpen} disabled={status === -1 || status === -2}>
        <EditIcon />
      </IconButton>

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
        <form noValidate onSubmit={handleSubmit((data) => handleSave(data))}>
          <DialogTitle>Edit Member</DialogTitle>

          <DialogContent sx={{ minWidth: "500px" }}>
            <DialogContentText marginBottom={1} fontWeight={500}>
              Update member information by editing the fields below. Ensure that the details are accurate and current.
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
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
