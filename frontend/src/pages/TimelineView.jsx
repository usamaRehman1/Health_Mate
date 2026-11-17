import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FileText, Activity, Calendar } from 'lucide-react';

export default function TimelineView() {
  const { reports, vitals, familyMembers = [], user } = useApp();

  // Aggregate and sort data elements by date chronologically 
  const timelineItems = [
    ...reports.map(r => ({ ...r, timelineType: 'report' })),
    ...vitals.map(v => ({ ...v, timelineType: 'vital', title: 'Manual Vitals Entry' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Timeline View </h1>
        <p className="text-slate-500 text-sm mt-0.5">Chronological historical logs across reports and vitals[cite: 12, 46].</p>
      </div>

      <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8">
        {timelineItems.map((item, index) => {
          const isReport = item.timelineType === 'report';
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Timeline Bubble Icon */}
              <span className={`absolute -left-[35px] top-0.5 p-1.5 rounded-full ring-4 ring-slate-50 shadow-sm ${isReport ? 'bg-teal-500 text-white' : 'bg-rose-500 text-white'}`}>
                {isReport ? <FileText className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              </span>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs font-medium text-teal-700 mt-1">
                      {item.memberName
                        || (item.memberId && item.memberId !== 'primary'
                          ? familyMembers.find((member) => member.id === item.memberId)?.name || 'Family member'
                          : user.name)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                {isReport ? (
                  <div className="text-xs text-slate-600 bg-teal-50/30 p-2.5 rounded-xl border border-teal-100/50">
                    <span className="font-bold text-teal-700 block mb-0.5">AI Insight Summary[cite: 10, 26]:</span>
                    <p className="line-clamp-2 italic font-medium">"{item.summary}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                    <div>
                      <span className="block text-slate-400 font-medium">BP [cite: 14]</span>
                      <span className="font-bold text-slate-700">{item.bp}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">Sugar [cite: 14]</span>
                      <span className="font-bold text-slate-700">{item.sugar}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">Weight</span>
                      <span className="font-bold text-slate-700">{item.weight}kg</span>
                    </div>
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-slate-400 font-medium pt-1">
                    <span className="font-bold text-slate-500">Log Note:</span> {item.notes}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}