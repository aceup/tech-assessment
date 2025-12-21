import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import useCreateOrder from '../../hooks/useCreateOrder';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from "@mui/material/Typography";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '2%',
    boxShadow: 10,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};


const OrderFormModal = ({ showModal, onClose, onOrderCreated }) => {

    const orderInitialValues = {
        title: '',
        client: '',
        description: '',
        dueDate: dayjs()
    }

    const [formData, setFormData] = useState(orderInitialValues);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const { createOrder } = useCreateOrder();

    useEffect(() => {
        setDisabled(formData.title.trim() === '');
    }, [formData.title]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            dueDate: newValue
        }));
    };

    const onCreateOrder = async () => {
        setLoading(true);
        const creationResult = await createOrder(formData);
        if (creationResult.error) {
            alert(creationResult.error);
            setLoading(false);
        } else {
            setLoading(false);
            onClose();
            setFormData(orderInitialValues);
            if (onOrderCreated) {
                await onOrderCreated();
            }
        }
    };

    return (
        <Modal
            open={showModal}
            onClose={onClose}
            aria-labelledby="Create Order"
            aria-describedby="Create Order by filling the form"
        >
            <Box sx={style}>
                <Typography variant="h3" sx={{ textAlign: "center", mb: 3 }}>
                    Create Order
                </Typography>
                <TextField
                    required
                    name="title"
                    label="Title"
                    helperText="eg: Order for new product A"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <TextField
                    name="client"
                    label="Client"
                    helperText="eg: Client C"
                    value={formData.client}
                    onChange={handleInputChange}
                />
                <TextField
                    name="description"
                    label="Description"
                    helperText="eg: Participation in Japan contest according to..."
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        disablePast
                        label="Due Date"
                        value={formData.dueDate}
                        onChange={handleDateChange}
                        sx={{ width: '100%', mt: 1 }}
                    />
                </LocalizationProvider>
                <Button loading={loading} disabled={disabled} onClick={onCreateOrder} sx={{ mt: 1, height: '40px', bgcolor: '#eceff1', border: 'none', color: 'black' }}>
                    Create
                </Button>
            </Box>
        </Modal>
    )
}

export default OrderFormModal;