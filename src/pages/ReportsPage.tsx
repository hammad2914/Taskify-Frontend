import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart3, Loader2, Download, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/api/axios';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import type { Project, ApiResponse } from '@/types';

/* ── matches the backend ReportData shape ── */
interface BackendReportData {
  summary: string;
  performanceScore: number;
  keyMetrics: { label: string; value: string }[];
  risks: { level: 'HIGH' | 'MEDIUM' | 'LOW'; description: string }[];
  recommendations: string[];
}

interface Report {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  data: BackendReportData;           // stored as `data` in Prisma
  project?: { name: string };
  createdBy: { fullName: string };
}

const RISK_COLORS: Record<string, string> = {
  HIGH:   'bg-danger/10 text-danger border border-danger/20',
  MEDIUM: 'bg-warning/10 text-warning border border-warning/20',
  LOW:    'bg-indigo/10 text-indigo border border-indigo/20',
};

export function ReportsPage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [reportType, setReportType] = useState('PROJECT_SUMMARY');
  const { toast } = useToast();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<ApiResponse<Project[]>>('/projects').then((r) => r.data.data),
  });

  const {
    data: reports = [],
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports', selectedProject],
    queryFn: () =>
      api.get<ApiResponse<Report[]>>('/reports', {
        params: selectedProject !== 'all' ? { projectId: selectedProject } : undefined,
      }).then((r) => r.data.data),
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      api.post<ApiResponse<{ report: Report; data: BackendReportData }>>('/reports/generate', {
        type: reportType,          // backend expects `type` not `reportType`
        title: `${reportType.replace(/_/g, ' ')} — ${format(new Date(), 'MMM d, yyyy')}`,
        projectId: selectedProject !== 'all' ? selectedProject : undefined,
      }),
    onSuccess: () => {
      void refetchReports();
      toast({ title: '✅ Report generated!', description: 'Your AI report is ready.' });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ variant: 'destructive', title: 'Generation failed', description: e.response?.data?.message ?? 'Could not generate report' });
    },
  });

  const downloadReport = async (reportId: string) => {
    try {
      const res = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast({ variant: 'destructive', title: 'Download failed' });
    }
  };

  const latestReport = reports[0];
  const rd = latestReport?.data;          // BackendReportData (may be undefined)

  const scoreColor = !rd
    ? '#6366F1'
    : rd.performanceScore >= 75 ? '#10B981'
    : rd.performanceScore >= 50 ? '#F59E0B'
    : '#EF4444';

  /* Build a bar-chart friendly array from keyMetrics */
  const metricChartData = rd?.keyMetrics?.map((m) => ({
    label: m.label,
    value: parseFloat(m.value) || 0,
  })) ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Reports</h1>
          <p className="text-sm text-white/35 mt-1">AI-powered insights and project analytics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-44 h-10 bg-surface border-white/[0.08] text-white/70 rounded-xl">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="glass-elevated border-white/[0.08] rounded-xl">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48 h-10 bg-surface border-white/[0.08] text-white/70 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-elevated border-white/[0.08] rounded-xl">
              <SelectItem value="PROJECT_SUMMARY">Project Summary</SelectItem>
              <SelectItem value="TIMELINE_ANALYSIS">Timeline Analysis</SelectItem>
              <SelectItem value="RISK_DETECTION">Risk Detection</SelectItem>
              <SelectItem value="USER_PERFORMANCE">User Performance</SelectItem>
              <SelectItem value="PRODUCTIVITY_INSIGHTS">Productivity Insights</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="bg-gradient-primary text-white rounded-xl h-10 px-4 shimmer shadow-glow-sm hover:shadow-glow transition-all gap-2"
          >
            {generateMutation.isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              : <><Sparkles className="h-4 w-4" /> Generate Report</>}
          </Button>
        </div>
      </div>

      {/* KPI row — only shown when a report exists */}
      {rd && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger animate-fade-up" style={{ animationDelay: '60ms' }}>
          {[
            { label: 'Performance Score', value: `${rd.performanceScore}/100`, color: scoreColor },
            { label: 'Key Metrics',        value: rd.keyMetrics?.length ?? 0,  color: '#6366F1' },
            { label: 'Risks Identified',   value: rd.risks?.length ?? 0,       color: '#F59E0B' },
            { label: 'Recommendations',    value: rd.recommendations?.length ?? 0, color: '#10B981' },
          ].map(({ label, value, color }, i) => (
            <div key={label} className="glass rounded-2xl p-5 card-hover animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{label}</p>
              <p className="font-heading font-bold text-3xl" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts + reports list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Key Metrics bar chart */}
        {metricChartData.length > 0 && (
          <div className="glass rounded-2xl p-5 lg:col-span-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-4">Key Metrics</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={metricChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 12, color: "hsl(var(--foreground))", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }} cursor={{ stroke: "rgba(99,102,241,0.25)", strokeWidth: 1 }} />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Reports list */}
        <div className={cn(
          'glass rounded-2xl p-5 space-y-3',
          metricChartData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5',
        )}>
          <h2 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo" /> Generated Reports
          </h2>
          {reportsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl skeleton" />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <BarChart3 className="h-8 w-8 text-white/10 mb-2" />
              <p className="text-sm text-white/30">No reports yet</p>
              <p className="text-xs text-white/20 mt-1">Click "Generate Report" to create one</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto stagger">
              {reports.map((report, i) => {
                const score = report.data?.performanceScore ?? 0;
                const sColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
                return (
                  <div key={report.id}
                    className="flex items-center gap-3 rounded-xl p-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all group animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/75 truncate">{report.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-white/30 font-mono">
                          {format(new Date(report.createdAt), 'MMM d, h:mm a')}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: `${sColor}20`, color: sColor, border: `1px solid ${sColor}30` }}>
                          {score}/100
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost"
                      onClick={() => void downloadReport(report.id)}
                      className="h-7 w-7 text-white/30 hover:text-white hover:bg-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Latest report detail — only shown when `data` exists */}
      {rd && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
          {/* Summary */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet" /> AI Summary
            </h2>
            <p className="text-sm text-white/55 leading-relaxed">{rd.summary}</p>

            {/* Key metrics table */}
            {rd.keyMetrics?.length > 0 && (
              <div className="mt-3 divide-y divide-white/[0.05]">
                {rd.keyMetrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-2">
                    <span className="text-xs text-white/40">{m.label}</span>
                    <span className="text-xs font-semibold text-white/70 font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risks */}
          {rd.risks?.length > 0 && (
            <div className="glass rounded-2xl p-5 space-y-3">
              <h2 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" /> Risk Assessment
              </h2>
              <div className="space-y-2.5">
                {rd.risks.map((r, i) => (
                  <div key={i} className={cn('flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-sm', RISK_COLORS[r.level] ?? RISK_COLORS['LOW'])}>
                    <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">{r.level}</span>
                    <p className="leading-relaxed">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {rd.recommendations?.length > 0 && (
            <div className="glass rounded-2xl p-5 space-y-3 lg:col-span-2">
              <h2 className="font-heading font-semibold text-sm text-white">Recommendations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
                {rd.recommendations.map((rec, i) => (
                  <div key={i}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 flex items-start gap-2.5 animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="h-5 w-5 rounded-full bg-indigo/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-indigo">
                      {i + 1}
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
