const useFetchOrders = () => {
    const get_url = "http://localhost:3000/orders"

    const fetchOrders = async () => {
        try {
            const res = await fetch(get_url);
            if (!res.ok) {
                throw new Error('Error fetching tasks');
            }
            const data = await res.json();
            return data;
        } catch (error) {
            return { error: error.message }
        }
    };

    return { fetchOrders };
}

export default useFetchOrders;