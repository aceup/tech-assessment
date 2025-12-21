const useCreateOrder = () => {
    const api_url = "http://localhost:3000/orders"

    const createOrder = async (order) => {
        try {

            const result = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ order })
            })
            const data = result.json();

            if (!result.ok) {
                throw new Error(data.errors?.join(', ') || 'Error creating order');
            }
            return data;
        } catch (error) {
            return ({ error: error.message })
        }
    }

    return { createOrder };
};

export default useCreateOrder;