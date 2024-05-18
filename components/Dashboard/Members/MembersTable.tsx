import { Box, Chip, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ToggleStatus from "./ToggleStatus";

export default function MembersTable({ users }: { users: any[] }) {
  const renderStatus = (id: string, status: number) => {
    switch (status) {
      case -1:
        return (
          <Typography variant="body2" color="text.disabled">
            pending
          </Typography>
        );
      case -2:
        return (
          <Typography variant="body2" color="text.disabled">
            declined
          </Typography>
        );
      default:
        return <ToggleStatus id={id} status={status} />;
    }
  };

  return (
    <Box sx={{ overflow: "auto" }} component={Paper} elevation={4}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Modules</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date added</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 1 && (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="center" colSpan={7}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 14 }}>
                    No members found. Start by adding new members.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {users.map((user, index) => {
              const { id, name, email, createdAt, role, status, profile } = user;
              const { modules } = profile;
              const dateAdded = moment(createdAt).format("MMM Do YY");
              if (role === "ADMIN") return;
              return (
                <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} maxWidth="200px" flexWrap="wrap">
                      {modules.map((module: any, index: number) => {
                        return module.isActive && <Chip key={index} label={module.title} size="small" />;
                      })}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{renderStatus(id, status)}</TableCell>
                  <TableCell align="center">{dateAdded}</TableCell>
                  <TableCell align="center">
                    <EditButton user={user} />
                    <DeleteButton id={id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
