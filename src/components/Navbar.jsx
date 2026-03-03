import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text">College Predictor</h1>
                            <p className="text-[10px] text-blue-400 -mt-1 tracking-widest uppercase">AI Powered</p>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === '/'
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
                                }`}
                        >
                            🎯 Predict
                        </Link>
                        {location.pathname === '/results' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-50 text-sky-700 shadow-sm"
                            >
                                📊 Results
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
