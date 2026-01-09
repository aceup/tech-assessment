import { useEffect, useState } from 'react';
import useFetchOrders from "../../hooks/useFetchOrders"
import OrdersDashboard from '../OrdersDashboard';
import OrdersTable from '../OrdersTable';
import OrderFormModal from '../forms/OrderFormModal';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const { fetchOrders } = useFetchOrders();
    const [showModal, setShowModal] = useState(false);

    const loadOrders = async () => {
        const obtainedOrders = await fetchOrders();
        if (obtainedOrders.error) {
            alert(obtainedOrders.error);
            return;
        } else {
            setOrders(obtainedOrders);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <>
            <Typography sx={{ mt: 4, mb: 3 }} variant="h2" component="div">
                Orders
            </Typography>
            <OrdersDashboard orders={orders} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 3 }}>
                <Button variant="contained" onClick={() => setShowModal(true)}>
                    New Order
                </Button>
            </Box>
            <OrdersTable orders={orders} />
            <OrderFormModal
                onClose={() => setShowModal(false)}
                showModal={showModal}
                onOrderCreated={loadOrders}
            />
        </>
    )
}

export default OrdersPage;