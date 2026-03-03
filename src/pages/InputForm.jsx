import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { examTypes, branches, categories, states } from '../data/mockData';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function InputForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', examType: '', score: '', category: '', branch: '', state: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Name is required';
        if (!formData.examType) e.examType = 'Select an exam type';
        if (!formData.score || isNaN(formData.score) || Number(formData.score) <= 0) e.score = 'Enter a valid score';
        if (!formData.category) e.category = 'Select a category';
        if (!formData.branch) e.branch = 'Select a branch';
        if (!formData.state) e.state = 'Select your state';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setIsSubmitting(true);
        setTimeout(() => {
            navigate('/results', { state: { formData: { ...formData, score: Number(formData.score) } } });
        }, 800);
    };

    const inputClass =
        'w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm';
    const labelClass = 'block text-sm font-semibold text-gray-600 mb-1.5';
    const errorClass = 'text-red-500 text-xs mt-1';

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        AI-Powered Prediction Engine
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-3">
                        Predict Your Admission
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Enter your details and discover your best-fit colleges instantly
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSubmit}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-100/50 border border-blue-50"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <motion.div variants={itemVariants} className="sm:col-span-2">
                            <label htmlFor="name" className={labelClass}>👤 Full Name</label>
                            <input id="name" name="name" type="text" placeholder="Enter your full name"
                                value={formData.name} onChange={handleChange} className={inputClass} />
                            {errors.name && <p className={errorClass}>{errors.name}</p>}
                        </motion.div>

                        {/* Exam Type */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="examType" className={labelClass}>📝 Exam Type</label>
                            <select id="examType" name="examType" value={formData.examType} onChange={handleChange} className={inputClass}>
                                <option value="">Select exam</option>
                                {examTypes.map((e) => (<option key={e} value={e}>{e}</option>))}
                            </select>
                            {errors.examType && <p className={errorClass}>{errors.examType}</p>}
                        </motion.div>

                        {/* Score */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="score" className={labelClass}>🎯 Score</label>
                            <input id="score" name="score" type="number" placeholder="Enter your score"
                                value={formData.score} onChange={handleChange} className={inputClass} />
                            {errors.score && <p className={errorClass}>{errors.score}</p>}
                        </motion.div>

                        {/* Category */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="category" className={labelClass}>🏷️ Category</label>
                            <select id="category" name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                                <option value="">Select category</option>
                                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                            </select>
                            {errors.category && <p className={errorClass}>{errors.category}</p>}
                        </motion.div>

                        {/* Branch */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="branch" className={labelClass}>🎓 Preferred Branch</label>
                            <select id="branch" name="branch" value={formData.branch} onChange={handleChange} className={inputClass}>
                                <option value="">Select branch</option>
                                {branches.map((b) => (<option key={b} value={b}>{b}</option>))}
                            </select>
                            {errors.branch && <p className={errorClass}>{errors.branch}</p>}
                        </motion.div>

                        {/* State */}
                        <motion.div variants={itemVariants} className="sm:col-span-2">
                            <label htmlFor="state" className={labelClass}>📍 State</label>
                            <select id="state" name="state" value={formData.state} onChange={handleChange} className={inputClass}>
                                <option value="">Select state</option>
                                {states.map((s) => (<option key={s} value={s}>{s}</option>))}
                            </select>
                            {errors.state && <p className={errorClass}>{errors.state}</p>}
                        </motion.div>
                    </div>

                    {/* Submit */}
                    <motion.div variants={itemVariants} className="mt-6">
                        <button type="submit" disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${isSubmitting
                                    ? 'bg-blue-300 cursor-wait'
                                    : 'btn-primary active:scale-[0.98]'
                                } text-white`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : '🚀 Predict My Chances'}
                        </button>
                    </motion.div>
                </motion.form>

                {/* Feature badges */}
                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mt-6">
                    {['College Recommendations', 'Placement Data', 'Cutoff Trends', 'Career Insights'].map((f) => (
                        <span key={f} className="px-3 py-1 rounded-full bg-white/80 border border-blue-100 text-xs font-medium text-blue-600 shadow-sm">
                            ✨ {f}
                        </span>
                    ))}
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-gray-400 text-xs mt-4">
                    * Predictions are based on historical cutoff trends and simulated AI analysis
                </motion.p>
            </motion.div>
        </div>
    );
}
