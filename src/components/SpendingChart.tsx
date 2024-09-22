import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpendings } from '../store/spendingsQuery';
import { RootState } from '../store/store';
import ReactECharts from 'echarts-for-react';
import Swal from 'sweetalert2';

const SpendingChart: React.FC = () => {
    const [userId, setUserId] = useState<number | string>('');
    const [showChart, setShowChart] = useState<boolean>(false); // State to control chart display
    const dispatch = useDispatch();

    // Select spendings and loading state from Redux store
    const spendings = useSelector((state: RootState) => state.spendings.spendings);
    const isLoading = useSelector((state: RootState) => state.spendings.loading);

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
        setShowChart(false); // Reset chart visibility when userId changes
    };

    const handleFetchData = () => {
        if (!userId) {
            Swal.fire({
                icon: 'warning',
                title: 'User ID Required',
                text: 'Please enter a User ID to fetch data.',
            });
            return;
        }
        // Dispatch the action to fetch spendings for the specific user ID
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(fetchSpendings({ filters: { userid: Number(userId) }, page: 1 })).then(() => {
            setShowChart(true); // Show chart only after data has been fetched
        });
    };

    const getChartDataByType = () => {
        if (!spendings || spendings.length === 0) return { types: [], counts: [] };

        const spendingByType: Record<string, number> = {};

        spendings.forEach(spending => {
            if (spending.type in spendingByType) {
                spendingByType[spending.type] += spending.count;
            } else {
                spendingByType[spending.type] = spending.count;
            }
        });

        const types = Object.keys(spendingByType);
        const counts = Object.values(spendingByType);

        return { types, counts };
    };

    const { types, counts } = getChartDataByType();

    const options = {
        title: {
            text: `Spending Overview for User ID: ${userId}`,
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: types,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Count',
                type: 'bar',
                data: counts,
            },
        ],
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Spending Chart</h2>
            <div className="mb-4">
                <label className="block mb-1 text-gray-600">User ID</label>
                <input
                    type="number"
                    value={userId}
                    onChange={handleUserIdChange}
                    className="border rounded-lg p-2 w-full"
                    placeholder="Enter User ID"
                />
                <button
                    onClick={handleFetchData}
                    className="bg-blue-500 text-white p-2 rounded-lg w-full mt-2"
                >
                    Fetch Data
                </button>
            </div>

            {showChart && types.length > 0 ? (
                <ReactECharts option={options} />
            ) : (
                userId && showChart && <p>No data available for this User ID.</p>
            )}
        </div>
    );
};

export default SpendingChart;
