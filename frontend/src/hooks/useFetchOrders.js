import orderService from '../services/orderService';

const useFetchOrders = () => {
    const fetchOrders = async () => {
        try {
            const data = await orderService.getAll();
            return data;
        } catch (error) {
            return { error: error.message };
        }
    };

    return { fetchOrders };
};

export default useFetchOrders;