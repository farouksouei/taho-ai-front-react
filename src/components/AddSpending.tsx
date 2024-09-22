import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSpending, updateSpending } from '../store/spendingsQuery';
import { NewSpending, Spending } from '../models/spendings';
import Swal from 'sweetalert2';

const AddSpending: React.FC = () => {
    const [spendingData, setSpendingData] = useState<NewSpending>({
        userid: 0,
        count: 0,
        type: '',
        model: '',
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const spendings = useSelector((state: any) => state.spendings.spendings);

    useEffect(() => {
        if (id) {
            const spending = spendings.find((s: Spending) => s.id === Number(id));
            if (spending) {
                setSpendingData(spending);
            }
        }
    }, [id, spendings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSpendingData((prev) => ({
            ...prev,
            [name]: name === 'userid' || name === 'count' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            if (id) {
                // Edit existing spending
                // remove the id from the spendingData object
                const updatedData = {
                    userid: spendingData.userid,
                    count: spendingData.count,
                    type: spendingData.type,
                    model: spendingData.model,
                };// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await dispatch(updateSpending({ id: Number(id), data: updatedData }));
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Spending entry updated successfully!',
                });
            } else {
                // Add new spending
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await dispatch(addSpending(spendingData));
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Spending entry added successfully!',
                });
            }
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError('An error occurred while processing the request.');
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing the request.',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Spending' : 'Add New Spending'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">User ID</label>
                    <input
                        type="number"
                        name="userid"
                        value={spendingData.userid}
                        onChange={handleChange}
                        className="border rounded-lg p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Count</label>
                    <input
                        type="number"
                        name="count"
                        value={spendingData.count}
                        onChange={handleChange}
                        className="border rounded-lg p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Type</label>
                    <select
                        name="type"
                        value={spendingData.type}
                        onChange={handleChange}
                        className="border rounded-lg p-2 w-full"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Model</label>
                    <select
                        name="model"
                        value={spendingData.model}
                        onChange={handleChange}
                        className="border rounded-lg p-2 w-full"
                        required
                    >
                        <option value="">Select Model</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Mobile Payment">Mobile Payment</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition duration-200"
                >
                    {id ? 'Update Spending' : 'Add Spending'}
                </button>
            </form>
        </div>
    );
};

export default AddSpending;
