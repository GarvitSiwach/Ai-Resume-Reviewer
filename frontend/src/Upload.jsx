import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cloud, Loader2, FileText, Shield, Zap, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await axios.post('/api/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const resumeId = uploadRes.data.id;
            await axios.post(`/api/resumes/${resumeId}/verify`);
            navigate(`/report/${resumeId}`);
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert("Failed to process resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Shield, label: 'Secure Upload', gradient: 'from-primary to-accent' },
        { icon: Zap, label: 'AI-Powered', gradient: 'from-accent to-primary' },
        { icon: CheckCircle, label: 'Instant Results', gradient: 'from-primary to-secondary' },
    ];

    return (
        <div className="min-h-screen w-full bg-background relative overflow-hidden flex items-center justify-center">
            {/* Animated Purple Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Main Content - Centered */}
            <div className="w-full max-w-5xl mx-auto px-6 py-12 relative z-10">
                {/* Header with Gold Accent */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30 mb-6">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent font-medium">AI-Powered Verification</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                            Resume Credibility
                        </span>
                        <br />
                        <span className="text-white">Scanner</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Upload your resume for deep AI-powered verification and receive a comprehensive credibility assessment
                    </p>
                </motion.div>

                {/* Main Upload Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative"
                >
                    {/* Card with Purple Glow */}
                    <div className="relative bg-gradient-to-br from-surface/80 to-surface-light/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-primary/20 shadow-glow-purple">
                        {/* Gold Corner Accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full" />

                        {/* Upload Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-16 transition-all duration-300 ${isDragging
                                ? 'border-accent bg-accent/10 shadow-glow-gold animate-glow-pulse'
                                : 'border-primary/40 hover:border-primary hover:bg-primary/5'
                                }`}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />

                            <AnimatePresence mode="wait">
                                {file ? (
                                    <motion.div
                                        key="file-selected"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center mb-6 border-2 border-accent/50 shadow-glow-gold">
                                            <FileText size={48} className="text-accent" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{file.name}</h3>
                                        <p className="text-text-muted mb-8">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="text-sm text-accent hover:text-accent-light underline z-30 transition-colors font-medium"
                                        >
                                            Remove file
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload-prompt"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <motion.div
                                            className={`w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-8 border-2 ${isDragging ? 'border-accent shadow-glow-gold' : 'border-primary/40'
                                                } transition-all duration-300`}
                                            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                                        >
                                            <Cloud size={56} className={`${isDragging ? 'text-accent' : 'text-primary'} transition-colors`} />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
                                        </h3>
                                        <p className="text-text-muted mb-2 text-lg">
                                            or click to browse
                                        </p>
                                        <p className="text-text-dim">
                                            PDF only • Max 10MB
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit Button with Gold Gradient */}
                        <motion.button
                            whileHover={{ scale: file && !loading ? 1.02 : 1 }}
                            whileTap={{ scale: file && !loading ? 0.98 : 1 }}
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full mt-8 py-6 px-8 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${!file || loading
                                ? "bg-surface-light text-text-dim cursor-not-allowed border border-surface-light"
                                : "bg-gradient-to-r from-primary via-accent to-primary text-black shadow-glow-strong hover:shadow-glow-gold border border-accent/50"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Analyzing Resume...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Start Analysis</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Feature Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                            className="relative group"
                        >
                            <div className="bg-gradient-to-br from-surface/90 to-surface-light/70 backdrop-blur-lg rounded-2xl p-6 border border-primary/20 hover:border-accent/40 transition-all duration-300 text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 shadow-lg group-hover:shadow-glow-gold transition-all duration-300`}>
                                    <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center">
                                        <feature.icon size={32} className="text-white" />
                                    </div>
                                </div>
                                <h3 className="text-white font-semibold">{feature.label}</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
