"use client";

import { toggleUserStatus } from "@/app/actions";
import Switch from "@mui/material/Switch";
import { useState, useTransition } from "react";

export default function ToggleStatus({ id, status }: { id: string; status: number }) {
  const [checked, setChecked] = useState(status === 1);

  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const newStatus = checked ? 0 : 1;
    startTransition(() => toggleUserStatus(id, newStatus));
  };

  return <Switch checked={checked} onChange={handleChange} disabled={isPending} />;
}
