import { Link, Typography } from "@mui/material";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
      {"Copyright © "}
      <Link color="inherit" href="/">
        Pipeline Conversion Kit
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
