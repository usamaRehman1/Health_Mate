import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Activity, ArrowLeft, Loader2 } from 'lucide-react';

export default function AddVitals() {
  const { addVital, selectedMemberId } = useApp();
  const navigate = useNavigate();
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleVitalSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const bloodPressure = bp.match(/^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/);
    if (!bloodPressure) {
      setError('Enter blood pressure as systolic/diastolic, for example 120/80.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await addVital({
        memberId: selectedMemberId,
        bp: {
          systolic: Number(bloodPressure[1]),
          diastolic: Number(bloodPressure[2]),
        },
        sugar: Number(sugar),
        weight: Number(weight),
        notes,
        date: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError || 'Unable to save vitals.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-rose-500" />
            <span>Add Manual Vitals </span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Log current daily metrics directly to track trends. [cite: 13, 14]</p>
        </div>

        <form onSubmit={handleVitalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Blood Pressure (mmHg) [cite: 14, 44]</label>
            <input type="text" required pattern="[0-9]{2,3}\s*/\s*[0-9]{2,3}" value={bp} onChange={(e) => setBp(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g., 120/80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Sugar (mg/dL) </label>
              <input type="number" required min="0" step="any" value={sugar} onChange={(e) => setSugar(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g., 95" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Weight (kg) </label>
              <input type="number" required min="0" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g., 70" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Daily Log Notes </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none" placeholder="How are you feeling right now?"></textarea>
          </div>

          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

          <button type="submit" disabled={saving} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving Vitals...' : 'Save Vitals Log'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}