import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, AlertCircle, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Report = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get(`/api/resumes/${id}/report`);
                setReport(res.data);
            } catch (error) {
                console.error("Error fetching report:", error);
                alert("Failed to load report");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Loading report...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={64} className="text-danger mx-auto mb-4" />
                    <p className="text-text-muted">Report not found</p>
                </div>
            </div>
        );
    }

    const truthScore = Math.round(report.truthScore || 0);
    const getScoreColor = (score) => {
        if (score >= 80) return { stroke: '#10b981', text: 'text-success', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]' };
        if (score >= 60) return { stroke: '#fbbf24', text: 'text-accent', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]' };
        return { stroke: '#ef4444', text: 'text-danger', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' };
    };

    const scoreColor = getScoreColor(truthScore);
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (truthScore / 100) * circumference;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Upload</span>
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-accent" size={32} />
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                            Verification Report
                        </h1>
                    </div>
                    <p className="text-text-muted">AI-powered analysis of resume credibility</p>
                </motion.div>

                {/* Truth Score Gauge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-surface/80 to-surface-light/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-primary/20 shadow-glow-purple mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="relative">
                            <svg width="220" height="220" className={scoreColor.glow}>
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="90"
                                    fill="none"
                                    stroke="rgba(139, 92, 246, 0.1)"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="90"
                                    fill="none"
                                    stroke={scoreColor.stroke}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    transform="rotate(-90 110 110)"
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-bold ${scoreColor.text}`}>{truthScore}%</span>
                                <span className="text-text-muted text-sm">Truth Score</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-4">Overall Assessment</h2>
                            <p className="text-text-muted leading-relaxed">
                                {truthScore >= 80 && "This resume shows high credibility with consistent information and verifiable claims."}
                                {truthScore >= 60 && truthScore < 80 && "This resume has moderate credibility with some areas requiring verification."}
                                {truthScore < 60 && "This resume shows low credibility with multiple inconsistencies that need clarification."}
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-surface/50 rounded-xl p-4 border border-primary/10">
                                    <p className="text-text-dim text-sm mb-1">Suspicious Points</p>
                                    <p className="text-2xl font-bold text-white">{report.suspiciousPoints?.length || 0}</p>
                                </div>
                                <div className="bg-surface/50 rounded-xl p-4 border border-primary/10">
                                    <p className="text-text-dim text-sm mb-1">Follow-up Questions</p>
                                    <p className="text-2xl font-bold text-white">{report.followUpQuestions?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Suspicious Points */}
                {report.suspiciousPoints && report.suspiciousPoints.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-surface/80 to-surface-light/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-primary/20 shadow-glow-purple mb-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-accent" size={28} />
                            <h2 className="text-2xl font-bold text-white">Suspicious Points</h2>
                        </div>
                        <div className="space-y-4">
                            {report.suspiciousPoints.map((point, idx) => (
                                <div key={idx} className="bg-surface/50 rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-accent font-bold">
                                            {idx + 1}
                                        </div>
                                        <p className="text-text-muted flex-1">{point}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Follow-up Questions */}
                {report.followUpQuestions && report.followUpQuestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-surface/80 to-surface-light/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-primary/20 shadow-glow-purple"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-white">Follow-up Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {report.followUpQuestions.map((question, idx) => (
                                <div key={idx} className="bg-surface/50 rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold">
                                            {idx + 1}
                                        </div>
                                        <p className="text-text-muted flex-1">{question}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Report;
