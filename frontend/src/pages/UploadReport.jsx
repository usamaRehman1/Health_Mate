import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';

export default function UploadReport() {
  const { uploadReport, selectedMemberId } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const uploadInProgress = useRef(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || uploadInProgress.current) return;
    uploadInProgress.current = true;
    setLoading(true);
    setError('');
    try {
      await uploadReport({
        file,
        title: title.trim() || 'Scanned Health Document',
        memberId: selectedMemberId,
      });
      navigate('/dashboard', { replace: true });
    } catch (uploadError) {
      setError(uploadError || 'Unable to upload report.');
    } finally {
      uploadInProgress.current = false;
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Upload Health Document </h1>
          <p className="text-slate-500 text-xs mt-0.5">Upload once. Your report and its AI analysis will appear on the dashboard.</p>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-6 text-center transition-all bg-slate-50 relative group cursor-pointer">
            <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} disabled={loading} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-2 pointer-events-none">
              <div className="p-3 bg-white shadow-sm rounded-xl inline-block text-slate-400 group-hover:text-teal-500 transition-colors">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">{file ? file.name : "Click or Drag File Here"}</p>
              <p className="text-xs text-slate-400">Supports PDFs, Images, or Lab Scans [cite: 21]</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Document Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g., Blood Report" />
          </div>

          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

          <button type="submit" disabled={!file || loading} className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 disabled:from-slate-200 disabled:to-slate-200 text-white font-semibold rounded-xl text-sm shadow-md flex items-center justify-center space-x-2 transition-all">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading and analyzing report...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload &amp; Analyze Once</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}