import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function CompaniesTable({ companies }: { companies: any[] }) {
  return (
    <Box sx={{ overflow: "auto" }} component={Paper} elevation={4}>
      <TableContainer>
        <Table sx={{ minWidth: 450 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Members</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {companies.length === 0 && (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="center" colSpan={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 14 }}>
                    No companies found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {companies.map((company, index) => {
              const { name, isActive, _count } = company;
              const { users } = _count;
              return (
                <TableRow key={index + 1} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{name}</TableCell>
                  <TableCell align="center">{isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell align="center">{users}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
