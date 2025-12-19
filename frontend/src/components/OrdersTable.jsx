import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const COLUMNS = ['Id', 'Title', 'Client', 'Description', 'Due date', 'Status'];

const OrdersTable = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="orders table">
        <TableHead>
          <TableRow>
            {
              COLUMNS.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.title}</TableCell>
              <TableCell>{order.client}</TableCell>
              <TableCell>{order.description}</TableCell>
              <TableCell>{order.due}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OrdersTable;