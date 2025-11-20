import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload Resume
            const uploadRes = await axios.post('http://localhost:8080/api/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const resumeId = uploadRes.data.id;

            // 2. Trigger Verification
            await axios.post(`http://localhost:8080/api/resumes/${resumeId}/verify`);

            // 3. Navigate to Report
            navigate(`/report/${resumeId}`);
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert("Failed to process resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Resume Verifier</h1>
                <p className="text-gray-500 mb-8">Upload a PDF resume to detect inconsistencies and get a truth score.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">{file ? file.name : "Click to upload PDF"}</p>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all ${!file || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </span>
                    ) : (
                        "Analyze Resume"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Upload;
