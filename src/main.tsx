import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  // Import Provider from react-redux
import App from './App';
import store from './store/store';  // Import the store you created
import './index.css'; // Import Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>  {/* Wrap App with Provider and pass the store */}
            <App />
        </Provider>
    </React.StrictMode>
);
