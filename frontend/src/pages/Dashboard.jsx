import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FileText, AlertTriangle, ChevronRight, Activity, Plus, Users, UserPlus, X, Check, User, Trash2, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const {
    user = { name: 'Guest' },
    reports = [],
    vitals = [],
    familyMembers = [],
    selectedMemberId,
    setSelectedMemberId,
    addFamilyMember,
    removeFamilyMember,
    familyMembersLoading,
    familyMembersError,
    vitalsError,
    reportsError,
  } = useApp();
  const navigate = useNavigate();

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Find currently active profile details
  const activeMember = selectedMemberId === 'primary'
    ? { id: 'primary', name: user.name, relation: 'Primary Account' }
    : familyMembers.find(m => m.id === selectedMemberId) || { id: 'primary', name: user.name, relation: 'Primary Account' };

  // Filter vitals and reports based on active selection
  const filteredVitals = vitals.filter(v => v.memberId === selectedMemberId || (!v.memberId && selectedMemberId === 'primary'));
  const filteredReports = reports.filter(r => r.memberId === selectedMemberId || (!r.memberId && selectedMemberId === 'primary'));
  
  const latestVital = filteredVitals[0] || {};
  const loadErrors = [familyMembersError, vitalsError, reportsError].filter(Boolean);

  // Form Submission Handler
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || isAddingMember) return;

    setIsAddingMember(true);
    try {
      const newMember = await addFamilyMember({
        name: newMemberName.trim(),
        relation: newMemberRelation,
      });

      setNewMemberName('');
      setIsModalOpen(false);
      setSelectedMemberId(newMember.id); // Automatically switch the dashboard view to the new member
      window.alert('Family profile added successfully!');
    } catch (error) {
      window.alert(error || 'Unable to add family member.');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleDeleteMember = async (member) => {
    const confirmed = window.confirm(`Delete ${member.name}'s family profile?`);
    if (!confirmed) return;

    try {
      await removeFamilyMember(member.id);
    } catch (error) {
      window.alert(error || 'Unable to delete family member.');
    }
  };

  // Safe navigation handlers carrying active profile context
  const handleNavigateToUpload = () => {
    navigate('/upload', { 
      state: { 
        memberId: selectedMemberId, 
        memberName: activeMember.name 
      } 
    });
  };

  const handleNavigateToVitals = () => {
    navigate('/vitals', { 
      state: { 
        memberId: selectedMemberId, 
        memberName: activeMember.name 
      } 
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assalam-o-Alaikum, {user.name}! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome to your personal family health vault. Select a profile below to manage records.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl text-sm border border-slate-200 hover:bg-slate-200 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
          <button 
            onClick={handleNavigateToUpload} 
            className="flex min-w-0 items-center space-x-1.5 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl text-sm shadow-md hover:bg-teal-700 transition-all"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="max-w-[140px] truncate">Upload for {activeMember.name}</span>
          </button>
        </div>
      </div>
      {loadErrors.length > 0 && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadErrors.join(' ')}
        </div>
      )}

      {/* Family Profiles Box Container - Placed prominently at the top */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 text-sm font-bold tracking-wide uppercase border-b border-slate-100 pb-3">
          <Users className="h-4 w-4 text-teal-600" />
          <span>Viewing Profile Records For:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {familyMembersLoading && (
            <p className="text-sm text-slate-400">Loading family profiles...</p>
          )}
          {/* Main User Card */}
          <div
            onClick={() => setSelectedMemberId('primary')}
            className={`min-w-0 p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
              selectedMemberId === 'primary' 
                ? 'bg-teal-50/60 border-teal-500 ring-2 ring-teal-600/10 shadow-sm' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${selectedMemberId === 'primary' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <User className="h-4 w-4" />
              </div>
              {selectedMemberId === 'primary' && (
                <span className="bg-teal-600 text-white p-0.5 rounded-full"><Check className="h-3 w-3" /></span>
              )}
            </div>
            <div className="mt-4 min-w-0">
              <h4 className="max-w-full truncate font-bold text-slate-800 text-sm" title={user.name}>{user.name}</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Primary Account (Me)</p>
            </div>
          </div>

          {/* Dynamic Family Member Cards */}
          {familyMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`min-w-0 p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                selectedMemberId === member.id 
                  ? 'bg-teal-50/60 border-teal-500 ring-2 ring-teal-600/10 shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${selectedMemberId === member.id ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  {selectedMemberId === member.id && (
                    <span className="bg-teal-600 text-white p-0.5 rounded-full"><Check className="h-3 w-3" /></span>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete ${member.name}'s profile`}
                    title={`Delete ${member.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteMember(member);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 min-w-0">
                <h4 className="max-w-full truncate font-bold text-slate-800 text-sm" title={member.name}>{member.name}</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{member.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Vitals Ribbon Quick Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><Activity className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold tracking-wide uppercase text-slate-400">Blood Pressure</p>
            <p className="text-xl font-bold text-slate-800">{latestVital.bp || '—'} <span className="text-xs font-normal text-slate-400">mmHg</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Activity className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold tracking-wide uppercase text-slate-400">Blood Sugar</p>
            <p className="text-xl font-bold text-slate-800">{latestVital.sugar ?? '—'} <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Activity className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold tracking-wide uppercase text-slate-400">Weight</p>
            <p className="text-xl font-bold text-slate-800">{latestVital.weight ?? '—'} <span className="text-xs font-normal text-slate-400">kg</span></p>
          </div>
        </div>
      </div>

      {/* Main Container Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports Registry */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <span>Recent Medical Reports for {activeMember.name}</span>
          </h2>
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                No health reports found for {activeMember.name}.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${report.abnormalFindings?.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">{report.title}</h3>
                      <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400">
                        <span>{report.type}</span> 
                        <span>•</span>
                        <span>{report.date}</span> 
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.abnormalFindings?.length > 0 && (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-amber-200">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Attention Value</span>
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-teal-500 transform group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Informative Vitals Track Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              <span>Vitals History ({activeMember.name})</span>
            </h2>
            <button onClick={handleNavigateToVitals} className="text-xs font-semibold text-teal-600 hover:underline">Add Entry</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {filteredVitals.length === 0 ? (
              <div className="text-center p-8 text-slate-400 text-xs">
                No logged entries for {activeMember.name}.
              </div>
            ) : (
              filteredVitals.slice(0, 3).map((v) => (
                <div key={v.id} className="p-4 space-y-1.5 text-sm hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500 text-xs">{v.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="block text-slate-400 font-medium">BP</span>
                      <span className="font-bold text-slate-700">{v.bp || '—'}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="block text-slate-400 font-medium">Sugar</span>
                      <span className="font-bold text-slate-700">{v.sugar ?? '—'}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="block text-slate-400 font-medium">Weight</span>
                      <span className="font-bold text-slate-700">{v.weight != null ? `${v.weight}kg` : '—'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => {
                if (!isAddingMember) setIsModalOpen(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden relative z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-teal-600" />
                  <span>Add Family Profile</span>
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isAddingMember} className="text-slate-400 hover:text-slate-600 disabled:opacity-50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isAddingMember}
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g., Ayesha Khan" 
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Relationship</label>
                  <select 
                    disabled={isAddingMember}
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 bg-white transition-colors"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isAddingMember}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md transition-all mt-2"
                >
                  {isAddingMember ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding Profile...
                    </span>
                  ) : 'Create Profile'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}