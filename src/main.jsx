import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../frontend/src/App.jsx';
import '../frontend/src/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
