import * as Icons from "@mui/icons-material/";
import { Link, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  href?: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
  onClick?: () => void;
}

export default function ListItem(props: Props) {
  const { title, href, icon, disabled, onClick } = props;
  const Icon = Icons[icon];
  const pathname = usePathname();

  return (
    <ListItemButton component={Link} href={href} disabled={disabled} selected={href === pathname} onClick={onClick}>
      <ListItemIcon>{<Icon />}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
}
