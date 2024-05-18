"use client";

import { deleteUser } from "@/app/actions";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useState, useTransition } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(() => deleteUser(id));
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClickOpen}>
        {isPending ? <CircularProgress size="1.5rem" /> : <DeleteIcon />}
      </IconButton>

      <Dialog open={open} onClose={handleClose} disableRestoreFocus>
        <DialogTitle>Confirmation Required</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action is irreversible and will permanently remove all
            associated data.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button onClick={handleConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
