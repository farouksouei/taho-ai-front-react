import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSpendings,
    setFilter,
    setCurrentPage,
    deleteSpending,
    Spending,
} from '../store/spendingsQuery';
import { RootState } from '../store/store';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const SpendingsTable: React.FC = () => {
    const dispatch = useDispatch();
    const { spendings, loading, error, filters, currentPage, totalPages } = useSelector(
        (state: RootState) => state.spendings
    );
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(fetchSpendings({ filters, page: currentPage }));
    }, [dispatch, filters, currentPage]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch(setFilter({ [name]: value }));
    };

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                dispatch(deleteSpending(id));
                Swal.fire('Deleted!', 'Your spending has been deleted.', 'success');
            }
        });
    };

    const handleEdit = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be redirected to edit this spending.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, edit it!',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/spendings/edit/${id}`);
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Spendings</h1>
            <div className="mb-4 flex flex-wrap gap-4">
                <input
                    type="text"
                    name="userid"
                    placeholder="User ID"
                    className="border rounded-lg p-2 w-1/4"
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="startdate"
                    className="border rounded-lg p-2 w-1/4"
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="enddate"
                    className="border rounded-lg p-2 w-1/4"
                    onChange={handleFilterChange}
                />
                <select
                    name="type"
                    className="border rounded-lg p-2 w-1/4"
                    onChange={handleFilterChange}
                >
                    <option value="">Select Type</option>
                    <option value="Food">Food</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                </select>
                <select
                    name="model"
                    className="border rounded-lg p-2 w-1/4"
                    onChange={handleFilterChange}
                >
                    <option value="">Select Model</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Mobile Payment">Mobile Payment</option>
                </select>
            </div>

            {loading && <p className="text-center text-blue-600">Loading...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">User ID</th>
                    <th className="py-2 px-4 border">Count</th>
                    <th className="py-2 px-4 border">Type</th>
                    <th className="py-2 px-4 border">Model</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {spendings.map((spending: Spending) => (
                    <tr key={spending.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{spending.id}</td>
                        <td className="py-2 px-4 border">{spending.userid}</td>
                        <td className="py-2 px-4 border">{spending.count}</td>
                        <td className="py-2 px-4 border">{spending.type}</td>
                        <td className="py-2 px-4 border">{spending.model}</td>
                        <td className="py-2 px-4 border">{spending.createdat}</td>
                        <td className="py-2 px-4 border">
                            <button
                                onClick={() => handleEdit(spending.id)}
                                className="bg-blue-500 text-white rounded-lg px-2 py-1 hover:bg-blue-600 transition duration-200 mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(spending.id)}
                                className="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SpendingsTable;
