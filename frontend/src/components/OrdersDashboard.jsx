import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import CardContent from '@mui/material/CardContent';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';


const OrdersDashboard = ({ orders }) => {

    const pendingOrders = orders.filter((order) => order.status === 'pending');

    const ordersByMonth = orders.reduce((acc, order) => {
        const monthYear = order.due && dayjs(order.due).isValid()
            ? dayjs(order.due).format('MMM YYYY')
            : 'no due date';
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
    }, {});

    const sortedMonths = Object.keys(ordersByMonth).sort((a, b) => {
        if (a === 'no due date') return 1;
        if (b === 'no due date') return -1;
        return dayjs(a, 'MMM YYYY').valueOf() - dayjs(b, 'MMM YYYY').valueOf();
    });

    const monthLabels = sortedMonths;
    const monthCounts = sortedMonths.map(month => ordersByMonth[month]);

    const countByStatus = (statusString) => {
        const filteredByStatus = orders.filter((order) => order.status === statusString);
        return filteredByStatus.length;
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
                {/* Total Orders Card */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Card elevation={3} sx={{ flex: 1, mb: 2, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                Total Orders
                            </Typography>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                                {orders.length}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                Pending Orders
                            </Typography>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                                {pendingOrders.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Orders status pie */}
                <Grid item xs={12} md={8}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
                                Orders by Status
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: countByStatus('pending'), label: 'Pending' },
                                                { id: 1, value: countByStatus('processing'), label: 'Processing' },
                                                { id: 2, value: countByStatus('completed'), label: 'Completed' },
                                                { id: 3, value: countByStatus('cancelled'), label: 'Cancelled' },
                                            ],
                                        },
                                    ]}
                                    width={200}
                                    height={220}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Orders month-quantity Barchart */}
                <Grid item xs={12}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
                                Orders by Due Date Month
                            </Typography>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: monthLabels
                                }]}
                                series={[{
                                    data: monthCounts,
                                    color: '#1976d2'
                                }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default OrdersDashboard; 3