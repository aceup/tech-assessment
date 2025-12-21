import orderService from '../services/orderService';

const useCreateOrder = () => {
    const createOrder = async (order) => {
        try {
            const data = await orderService.create(order);
            return data;
        } catch (error) {
            return { error: error.message };
        }
    };

    return { createOrder };
};

export default useCreateOrder;