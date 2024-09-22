import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { fetchSpendings } from './store/spendingsQuery';
import SpendingTable from './components/SpendingTable';
import { RootState } from './store/store';
import AddSpending from "./components/AddSpending.tsx";
import SpendingChart from './components/SpendingChart.tsx';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.spendings);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(fetchSpendings({})); // Pass filters if needed
    }, [dispatch]);

    console.log('state of spendings', useSelector((state: RootState) => state.spendings));

    return (
        <Router>
            <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Spending Dashboard</h1>
                <nav className="mb-6 flex justify-center space-x-4">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200">Dashboard</Link>
                    <Link to="/spendings/add" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200">Add Spending</Link>
                    <Link to="/spendings/chart" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200">View Charts</Link>
                </nav>

                {loading && <p className="text-center text-blue-600">Loading spendings...</p>}

                <div className="bg-white shadow-md rounded-lg p-6">
                    <Routes>
                        <Route path="/" element={<SpendingTable />} />
                        <Route path="/spendings/chart" element={<SpendingChart />} />
                        <Route path="/spendings/add" element={<AddSpending />} />
                        <Route path="/spendings/edit/:id" element={<AddSpending />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
