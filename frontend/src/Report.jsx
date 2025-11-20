import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react';

const Report = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/resumes/${id}/report`);
                setReport(res.data);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading report...</div>;
    if (!report) return <div className="min-h-screen flex items-center justify-center">Report not found.</div>;

    const score = Math.round(report.truthScore * 100);
    const data = [
        { name: 'Truth', value: score },
        { name: 'Suspicion', value: 100 - score },
    ];
    const COLORS = [score > 70 ? '#10B981' : score > 40 ? '#F59E0B' : '#EF4444', '#E5E7EB'];

    const suspiciousPoints = JSON.parse(report.suspiciousJson || "[]");
    const questions = JSON.parse(report.questionsJson || "[]");

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Upload
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Report</h1>
                            <p className="text-gray-500">Resume ID: {id}</p>
                        </div>

                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        startAngle={180}
                                        endAngle={0}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                                <span className={`text-4xl font-bold`} style={{ color: COLORS[0] }}>{score}%</span>
                                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Truth Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-amber-500" /> Suspicious Points
                            </h2>
                            {suspiciousPoints.length > 0 ? (
                                <ul className="space-y-3">
                                    {suspiciousPoints.map((point, idx) => (
                                        <li key={idx} className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-100">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No major inconsistencies found.</p>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-blue-500" /> Follow-up Questions
                            </h2>
                            {questions.length > 0 ? (
                                <ul className="space-y-3">
                                    {questions.map((q, idx) => (
                                        <li key={idx} className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-100">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No follow-up questions generated.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
