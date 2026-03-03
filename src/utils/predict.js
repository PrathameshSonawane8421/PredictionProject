import { cutoffData, careerSuggestions, collegeDatabase, branchDemandData } from '../data/mockData';

/**
 * Main prediction function.
 */
export function getPrediction(score, examType, branch, category) {
    const branchData = cutoffData[examType]?.[branch]?.[category];

    if (!branchData) {
        return {
            status: 'Unknown', statusColor: 'medium', cutoff: 0,
            confidence: 0, trendData: [], careerSuggestion: null,
            colleges: [], percentile: 0, branchDemand: [], score,
        };
    }

    const currentCutoff = branchData[2026];
    const diff = score - currentCutoff;

    // Status
    let status, statusColor;
    if (diff >= 15) { status = 'High'; statusColor = 'high'; }
    else if (diff >= -15) { status = 'Medium'; statusColor = 'medium'; }
    else { status = 'Low'; statusColor = 'low'; }

    // Confidence (clamped 10–99)
    const confidence = Math.max(10, Math.min(99, 100 - Math.abs(diff)));

    // Trend data
    const trendData = Object.entries(branchData).map(([year, cutoff]) => ({
        year: parseInt(year), cutoff, score,
    }));

    // Percentile (simulated)
    const percentile = Math.max(1, Math.min(99, Math.round(50 + diff * 1.5)));

    // Career suggestion
    const careerSuggestion = careerSuggestions[branch] || null;

    // College recommendations
    const colleges = getCollegeRecommendations(score, branch);

    // Branch demand
    const branchDemand = branchDemandData[branch] || [];

    return {
        status, statusColor, cutoff: currentCutoff, confidence,
        trendData, careerSuggestion, colleges, percentile, branchDemand, score,
    };
}

/**
 * Returns top colleges matching the student's score, sorted by fit.
 */
function getCollegeRecommendations(score, branch) {
    const allColleges = collegeDatabase[branch] || [];
    return allColleges
        .filter((c) => score >= c.minScore * 0.7)          // loose filter
        .sort((a, b) => {
            // Sort by closest match first, then by rank
            const diffA = Math.abs(score - a.minScore);
            const diffB = Math.abs(score - b.minScore);
            if (diffA !== diffB) return diffA - diffB;
            return a.nirfRank - b.nirfRank;
        })
        .slice(0, 6)
        .map((c) => ({
            ...c,
            matchScore: Math.max(10, Math.min(99, 100 - Math.abs(score - c.minScore))),
        }));
}
