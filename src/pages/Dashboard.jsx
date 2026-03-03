import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell,
} from 'recharts';
import { getPrediction } from '../utils/predict';
import { useEffect, useMemo, useState } from 'react';

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
    }),
};

const statusEmojis = { high: '🎉', medium: '⚡', low: '📉' };
const statusLabels = { high: 'High Chance', medium: 'Medium Chance', low: 'Low Chance' };
const statusMessages = {
    high: 'Excellent! Your score is well above the cutoff. You have a strong chance of admission to top colleges.',
    medium: 'Your score is around the cutoff range. You have a moderate chance — explore multiple colleges.',
    low: 'Your score is below the expected cutoff. Consider improving your score or exploring alternative branches.',
};

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(target);
        if (isNaN(end)) return;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.round(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{prefix}{count}{suffix}</span>;
}

/* ── Confidence Ring ── */
function ConfidenceRing({ confidence, statusColor }) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (confidence / 100) * circumference;
    const strokeColor = statusColor === 'high' ? '#16a34a' : statusColor === 'medium' ? '#d97706' : '#dc2626';

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <motion.circle cx="50" cy="50" r="45" fill="none" stroke={strokeColor} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.4 }} className="text-3xl font-bold text-gray-800">
                    {confidence}%
                </motion.span>
                <span className="text-xs text-gray-500">Confidence</span>
            </div>
        </div>
    );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-xl p-3 shadow-lg border border-blue-100">
            <p className="text-gray-800 font-semibold mb-1">Year {label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color }} className="text-sm">
                    {entry.name}: <span className="font-bold">{entry.value}</span>
                </p>
            ))}
        </div>
    );
}

/* ── College Card ── */
function CollegeCard({ college, index }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            custom={index + 5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-blue-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            {/* Header */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                                #{college.nirfRank} NIRF
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                {college.matchScore}% Match
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">{college.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            📍 {college.location}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Est. {college.established}</p>
                        <p className="text-xs text-blue-600 font-medium">{college.accreditation}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 rounded-xl bg-blue-50/50">
                        <p className="text-lg font-bold text-blue-700">{college.placement.avgPackage}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Avg Package</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-green-50/50">
                        <p className="text-lg font-bold text-green-700">{college.placement.percentPlaced}%</p>
                        <p className="text-[10px] text-gray-500 uppercase">Placed</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-orange-50/50">
                        <p className="text-lg font-bold text-orange-700">{college.fees}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Fees</p>
                    </div>
                </div>

                <button onClick={() => setExpanded(!expanded)}
                    className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    {expanded ? '▲ Show Less' : '▼ View Full Details'}
                </button>
            </div>

            {/* Expanded */}
            {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }} className="border-t border-blue-50 p-5 bg-blue-50/20">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">🏫 Campus Size</p>
                            <p className="text-sm font-semibold text-gray-700">{college.campusSize}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">🎓 Acceptance Rate</p>
                            <p className="text-sm font-semibold text-gray-700">{college.acceptanceRate}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">💰 Highest Package</p>
                            <p className="text-sm font-semibold text-green-700">{college.placement.highestPackage}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">🏠 Hostel</p>
                            <p className="text-sm font-semibold text-gray-700">{college.hostel ? 'Available' : 'Not Available'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">⭐ Student Life</p>
                            <p className="text-sm font-semibold text-yellow-600">{college.studentLife}/5.0</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">📋 Min Score Required</p>
                            <p className="text-sm font-semibold text-gray-700">{college.minScore}</p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">🔬 Specialties</p>
                        <div className="flex flex-wrap gap-1.5">
                            {college.specialties.map((s) => (
                                <span key={s} className="px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-700">{s}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">🏢 Top Recruiters</p>
                        <div className="flex flex-wrap gap-1.5">
                            {college.placement.topRecruiters.map((r) => (
                                <span key={r} className="px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 font-medium">{r}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    useEffect(() => { if (!formData) navigate('/', { replace: true }); }, [formData, navigate]);

    const prediction = useMemo(() => {
        if (!formData) return null;
        return getPrediction(formData.score, formData.examType, formData.branch, formData.category);
    }, [formData]);

    if (!formData || !prediction) return null;

    const { status, statusColor, cutoff, confidence, trendData,
        careerSuggestion, colleges, percentile, branchDemand, score } = prediction;

    // Bar chart data for college placements
    const placementBarData = colleges.map((c) => ({
        name: c.name.length > 15 ? c.name.slice(0, 14) + '…' : c.name,
        avgPackage: parseFloat(c.placement.avgPackage.replace(/[₹ LPA]/g, '')),
        placed: c.placement.percentPlaced,
    }));

    // Pie chart for confidence
    const pieData = [
        { name: 'Confidence', value: confidence },
        { name: 'Remaining', value: 100 - confidence },
    ];
    const PIE_COLORS = ['#2563eb', '#e2e8f0'];

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text">
                        Results for {formData.name}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {formData.examType} · {formData.branch} · {formData.category} · {formData.state}
                    </p>
                </div>
                <button onClick={() => navigate('/')}
                    className="px-6 py-2.5 rounded-xl bg-white border border-blue-100 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
                    ← New Prediction
                </button>
            </motion.div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Your Score', value: score, icon: '🎯', color: 'blue' },
                    { label: 'Cutoff 2026', value: cutoff, icon: '📊', color: 'sky' },
                    { label: 'Percentile', value: `${percentile}th`, icon: '📈', color: 'green' },
                    { label: 'Colleges Matched', value: colleges.length, icon: '🏛️', color: 'purple' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                        className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm card-hover">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Status Card */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
                className={`rounded-2xl p-6 sm:p-8 status-bg-${statusColor} card-hover`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-6xl">{statusEmojis[statusColor]}</div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className={`text-2xl sm:text-3xl font-bold status-${statusColor}`}>
                            Admission: {statusLabels[statusColor]}
                        </h2>
                        <p className="text-gray-600 mt-2 max-w-2xl">{statusMessages[statusColor]}</p>
                    </div>
                </div>
            </motion.div>

            {/* Score vs Cutoff + Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
                    className="lg:col-span-2 bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Score vs Predicted Cutoff</h3>
                    <div className="flex items-end gap-8 justify-center h-48">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-500">Your Score</span>
                            <div className="relative w-20 bg-blue-50 rounded-xl overflow-hidden" style={{ height: '140px' }}>
                                <motion.div initial={{ height: 0 }}
                                    animate={{ height: `${Math.min((score / Math.max(score, cutoff, 1)) * 100, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                    className="absolute bottom-0 w-full rounded-xl bg-gradient-to-t from-blue-600 to-blue-400" />
                            </div>
                            <span className="text-xl font-bold text-blue-600">{score}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-500">Cutoff 2026</span>
                            <div className="relative w-20 bg-sky-50 rounded-xl overflow-hidden" style={{ height: '140px' }}>
                                <motion.div initial={{ height: 0 }}
                                    animate={{ height: `${Math.min((cutoff / Math.max(score, cutoff, 1)) * 100, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                    className="absolute bottom-0 w-full rounded-xl bg-gradient-to-t from-sky-500 to-sky-300" />
                            </div>
                            <span className="text-xl font-bold text-sky-500">{cutoff}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 justify-end">
                            <span className="text-sm text-gray-500">Difference</span>
                            <div className={`px-4 py-2 rounded-xl text-xl font-bold ${score >= cutoff ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                {score >= cutoff ? '+' : ''}{score - cutoff}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible"
                    className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Prediction Confidence</h3>
                    <ConfidenceRing confidence={confidence} statusColor={statusColor} />
                    <p className="text-gray-400 text-sm mt-3 text-center">Based on score-cutoff deviation</p>
                </motion.div>
            </div>

            {/* Percentile Bar */}
            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible"
                className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Score Percentile Rank</h3>
                <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                        animate={{ width: `${percentile}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 flex items-center justify-end pr-3">
                        <span className="text-white text-sm font-bold">{percentile}th percentile</span>
                    </motion.div>
                </div>
                <p className="text-gray-400 text-xs mt-2">You scored better than {percentile}% of students</p>
            </motion.div>

            {/* Cutoff Trend Chart */}
            <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible"
                className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Cutoff Trend (2024–2026)</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="cutoffGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="cutoff" name="Cutoff" stroke="#2563eb" strokeWidth={3}
                                fill="url(#cutoffGrad)" dot={{ fill: '#2563eb', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, fill: '#3b82f6' }} />
                            <Area type="monotone" dataKey="score" name="Your Score" stroke="#0ea5e9" strokeWidth={3}
                                fill="url(#scoreGrad)" dot={{ fill: '#0ea5e9', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, fill: '#38bdf8' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* ── COLLEGE RECOMMENDATIONS ── */}
            <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold gradient-text mb-4">🏛️ Recommended Colleges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {colleges.map((college, i) => (
                        <CollegeCard key={college.name} college={college} index={i} />
                    ))}
                </div>
            </motion.div>

            {/* Placement Bar Chart + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placement Comparison */}
                <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible"
                    className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Avg Package Comparison</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={placementBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-20} textAnchor="end" height={50} />
                                <YAxis stroke="#94a3b8" fontSize={11} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #bfdbfe' }} />
                                <Bar dataKey="avgPackage" name="Avg Package (LPA)" fill="#2563eb" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Branch Demand Radar */}
                <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible"
                    className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🔬 {formData.branch} – Industry Demand</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={branchDemand}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                                <Radar name={formData.branch} dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Top Recruiters Showcase */}
            {colleges.length > 0 && (
                <motion.div custom={9} variants={cardVariants} initial="hidden" animate="visible"
                    className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 Top Recruiters Across Recommendations</h3>
                    <div className="flex flex-wrap gap-2">
                        {[...new Set(colleges.flatMap((c) => c.placement.topRecruiters))].map((r) => (
                            <span key={r} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 text-sm font-medium text-blue-700 shadow-sm">
                                {r}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Career Suggestion */}
            {careerSuggestion && (
                <motion.div custom={10} variants={cardVariants} initial="hidden" animate="visible"
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-50 shadow-sm card-hover">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🤖 AI Career Suggestion</h3>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="text-xl font-bold gradient-text mb-2">{careerSuggestion.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{careerSuggestion.description}</p>
                            <div className="mt-4">
                                <span className="text-sm text-gray-500 block mb-1">Expected Salary Range:</span>
                                <span className="text-lg font-bold text-green-600">{careerSuggestion.avgSalary}</span>
                            </div>
                        </div>
                        <div className="lg:w-64">
                            <span className="text-sm text-gray-500 block mb-3">Key Skills to Develop:</span>
                            <div className="flex flex-wrap gap-2">
                                {careerSuggestion.skills.map((skill) => (
                                    <span key={skill}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Download Report (unique feature) */}
            <motion.div custom={11} variants={cardVariants} initial="hidden" animate="visible"
                className="text-center">
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl btn-primary text-white font-semibold shadow-lg shadow-blue-200"
                >
                    📄 Download Report
                </button>
                <p className="text-gray-400 text-xs mt-2">Print or save this page as a PDF</p>
            </motion.div>
        </div>
    );
}
