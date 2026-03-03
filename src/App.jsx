import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InputForm from './pages/InputForm';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<InputForm />} />
                    <Route path="/results" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
