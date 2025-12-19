import { useEffect, useState } from 'react';
import useFetchOrders from "../../hooks/useFetchOrders"
import Typography from "@mui/material/Typography";
import OrdersDashboard from '../OrdersDashboard';
import OrdersTable from '../OrdersTable';
import OrderForm from '../forms/OrderForm';

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const { fetchOrders } = useFetchOrders();

    useEffect(()=>{
        const fetchData = async () => {
            const obtainedOrders = await fetchOrders();
            if (obtainedOrders.error){
                alert(obtainedOrders.error);
                return;
            } else {
                setOrders(obtainedOrders);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Typography sx={{ mt: 4, mb: 3 }} variant="h2" component="div">
                Orders
            </Typography>
            <OrdersDashboard />
            <OrdersTable orders={orders} />
            <OrderForm />
        </>
    )
}

export default OrdersPage;