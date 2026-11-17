import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Activity,
  ClipboardList,
  Lightbulb,
  FileText,
  Languages,
  LoaderCircle,
  Download,
} from 'lucide-react';
import { translateSummaryAPI } from '../features/reports/reportsApi';

const formatLabel = (label) =>
  String(label)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatValue = (value) => {
  if (value == null || value === '') return '—';
  if (Array.isArray(value)) return value.map(formatValue).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const formatFinding = (finding) => {
  if (finding && typeof finding === 'object') {
    return Object.entries(finding)
      .map(([key, value]) => `${formatLabel(key)}: ${formatValue(value)}`)
      .join(' · ');
  }

  return formatValue(finding);
};

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports } = useApp();
  const [isRomanUrdu, setIsRomanUrdu] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState('');

  const report = reports.find(r => r.id === id);
  const reportFileUrl = typeof report?.imageUrl === 'string' ? report.imageUrl : '';
  const reportFilePath = reportFileUrl
    ? reportFileUrl.split(/[?#]/, 1)[0].toLowerCase()
    : '';
  const reportFileType = String(report?.mimeType || report?.fileType || '').toLowerCase();
  const isImage = reportFileType.startsWith('image/')
    || /\.(jpe?g|png|gif|webp|bmp)$/.test(reportFilePath);
  const parameters = Array.isArray(report?.parameters) ? report.parameters : [];
  const parameterColumns = [...new Set(parameters.flatMap((parameter) => (
    parameter && typeof parameter === 'object' && !Array.isArray(parameter)
      ? Object.keys(parameter)
      : ['parameter']
  )))];

  useEffect(() => {
    setIsRomanUrdu(false);
    setTranslatedSummary('');
    setIsTranslating(false);
    setTranslationError('');
  }, [id]);

  const handleSummaryLanguageToggle = async () => {
    if (translatedSummary) {
      setIsRomanUrdu((current) => !current);
      setTranslationError('');
      return;
    }

    if (!report?.summary || isTranslating) return;

    setIsTranslating(true);
    setTranslationError('');
    try {
      const response = await translateSummaryAPI(report.summary);
      const translatedText = response.data?.data?.summaryUrdu;
      if (typeof translatedText !== 'string' || !translatedText.trim()) {
        throw new Error('The translation service returned no Roman Urdu summary.');
      }

      setTranslatedSummary(translatedText);
      setIsRomanUrdu(true);
    } catch (error) {
      setTranslationError(
        error.response?.data?.message || error.message || 'Unable to translate this summary.'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  if (!report) {
    return <div className="text-center py-12 font-medium text-slate-500">Report entry not found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        {reportFileUrl && (
          <a
            href={reportFileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Download className="h-4 w-4" />
            <span>Download Original Report</span>
          </a>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-teal-50/60 px-6 py-7 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                {report.type}
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{report.title}</h1>
              <p className="mt-1 text-sm text-slate-500">Recorded on {report.date}</p>
            </div>
          </div>
        </header>

        <div className="space-y-7 p-5 sm:p-8">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">Original Report</h2>
            </div>
            {reportFileUrl ? (
              isImage ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <img
                    src={reportFileUrl}
                    alt={`Original ${report.title}`}
                    className="mx-auto max-h-[70vh] max-w-full rounded-xl object-contain"
                  />
                </div>
              ) : (
                <iframe
                  src={reportFileUrl}
                  title={`Original ${report.title}`}
                  className="h-[70vh] w-full rounded-2xl border border-slate-200 bg-slate-50"
                />
              )
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                The original report file is not available to preview or download.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-emerald-50/60 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-teal-800">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h2 className="text-base font-bold">Health Report Summary</h2>
            </div>
            {report.overallStatus && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-800">
                <Activity className="h-3.5 w-3.5" />
                {report.overallStatus}
              </div>
            )}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {isRomanUrdu ? translatedSummary : report.summary || 'No analysis summary is available for this report.'}
              </p>
              <button
                type="button"
                onClick={handleSummaryLanguageToggle}
                disabled={!report.summary || isTranslating}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs font-bold text-teal-800 shadow-sm transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTranslating
                  ? <LoaderCircle className="h-4 w-4 animate-spin" />
                  : <Languages className="h-4 w-4" />}
                {isTranslating
                  ? 'Translating...'
                  : isRomanUrdu ? 'Show English' : 'Roman Urdu'}
              </button>
            </div>
            {translationError && (
              <p role="alert" className="mt-3 text-xs font-medium text-rose-700">
                {translationError}
              </p>
            )}
          </section>

          {report.abnormalFindings?.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <div className="mb-3 flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-sm font-bold">Abnormal Findings</h2>
              </div>
              <ul className="space-y-2">
                {report.abnormalFindings.map((finding, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-6 text-amber-950">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{formatFinding(finding)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {parameters.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-teal-700" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Report Parameters</h2>
                  <p className="text-xs text-slate-500">{parameters.length} results from this report</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        {parameterColumns.map((column) => (
                          <th key={column} scope="col" className="whitespace-nowrap border-b border-slate-200 px-4 py-3">
                            {formatLabel(column)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {parameters.map((parameter, index) => (
                        <tr key={index} className="transition-colors hover:bg-teal-50/40">
                          {parameterColumns.map((column) => {
                            const value = parameter && typeof parameter === 'object' && !Array.isArray(parameter)
                              ? parameter[column]
                              : column === 'parameter' ? parameter : null;
                            const isStatus = /status|flag|result/i.test(column);
                            const statusText = formatValue(value);
                            const isAbnormal = isStatus && /high|low|abnormal|positive|critical/i.test(statusText);

                            return (
                              <td key={column} className="whitespace-nowrap px-4 py-3.5 text-slate-700">
                                {isStatus ? (
                                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    isAbnormal ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                                  }`}>
                                    {statusText}
                                  </span>
                                ) : statusText}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {report.unreadableSections?.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-sm font-bold text-slate-800">Unreadable Sections</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                {report.unreadableSections.map((section, i) => <li key={i}>{formatFinding(section)}</li>)}
              </ul>
            </section>
          )}

          {(report.possibleConcerns?.length > 0 || report.recommendations?.length > 0 || report.doctorQuestions?.length > 0) && (
            <div className="grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-2">
              {report.possibleConcerns?.length > 0 && (
                <section className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-sm font-bold text-slate-900">Possible Concerns</h2>
                  <ul className="mt-3 space-y-2">
                    {report.possibleConcerns.map((concern, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-6 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>{formatFinding(concern)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {report.recommendations?.length > 0 && (
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-sm font-bold text-slate-900">Recommendations</h2>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {report.recommendations.map((recommendation, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-6 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{formatFinding(recommendation)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {report.doctorQuestions?.length > 0 && (
                <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900">Questions to Ask Your Doctor</h2>
                  </div>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {report.doctorQuestions.map((question, i) => (
                      <li key={i} className="rounded-xl border border-blue-100 bg-white p-3 text-sm leading-6 text-slate-700">
                        “{formatFinding(question)}”
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          <p className="border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-500">
            {report.disclaimer || 'Always consult your doctor before making any decision.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}