import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

export default function Layout() {
    const location = useLocation();

    return (
        <div className="min-h-screen relative bg-[#f0f4f8]">
            {/* Soft blue background orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div className="relative z-10">
                <Navbar />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
}
