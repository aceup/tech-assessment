import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const COLUMNS = [
  { title: 'Id', width: '5%' },
  { title: 'Title', width: '18%' },
  { title: 'Client', width: '12%' },
  { title: 'Description', width: '35%' },
  { title: 'Due date', width: '15%' },
  { title: 'Status', width: '15%' },
];

const OrdersTable = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="orders table" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            {
              COLUMNS.map((column) => (
                <TableCell key={column.title} width={column.width}>{column.title}</TableCell>
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