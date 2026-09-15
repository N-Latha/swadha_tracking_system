import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  CheckCircle2, 
  Activity, 
  Wrench, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { DashboardStats, MachineStatus, IssueStatus } from '../../types';
import { mockMachines, mockSessions, mockIssues } from '../../services/mockData';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  useEffect(() => {
    const activeSessionsCount = mockSessions.filter(s => s.status === 'ACTIVE').length;
    setStats({
      totalMachines: mockMachines.length,
      available: mockMachines.filter(m => m.status === MachineStatus.AVAILABLE).length,
      inUse: mockMachines.filter(m => m.status === MachineStatus.IN_USE).length,
      underMaintenance: mockMachines.filter(m => m.status === MachineStatus.UNDER_MAINTENANCE).length,
      activeSessions: activeSessionsCount,
      issuesReportedToday: mockIssues.length
    });
  }, []);

  if (!stats) return <div className="py-12 text-center text-swadha-gray">Loading overview…</div>;

  const statCards = [
    { title: 'Total machines', value: stats.totalMachines, icon: Monitor, accent: 'border-swadha-orange', iconBg: 'bg-orange-50 text-swadha-orange' },
    { title: 'Available', value: stats.available, icon: CheckCircle2, accent: 'border-swadha-green', iconBg: 'bg-green-50 text-swadha-greenDark' },
    { title: 'In use now', value: stats.inUse, icon: Activity, accent: 'border-swadha-blue', iconBg: 'bg-sky-50 text-swadha-blue' },
    { title: 'Maintenance', value: stats.underMaintenance, icon: Wrench, accent: 'border-amber-400', iconBg: 'bg-amber-50 text-amber-600' },
    { title: 'Live sessions', value: stats.activeSessions, icon: Activity, accent: 'border-swadha-orange', iconBg: 'bg-orange-50 text-swadha-orange' },
    { title: 'Open issues', value: stats.issuesReportedToday, icon: AlertTriangle, accent: 'border-red-400', iconBg: 'bg-red-50 text-red-600' },
  ];

  const liveSessions = mockSessions.filter(s => s.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      <div className="bg-white border border-black/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-swadha-orange text-xs font-semibold uppercase tracking-[0.18em]">Welcome back</p>
          <h2 className="font-heading text-2xl font-bold text-swadha-dark mt-1">Lab is running smoothly</h2>
          <p className="text-swadha-gray text-sm mt-2 max-w-xl">
            {stats.available} machines are free, {stats.inUse} are in use, and {stats.issuesReportedToday} issue{stats.issuesReportedToday === 1 ? '' : 's'} need attention.
          </p>
        </div>
        <Link
          to="/admin/sessions"
          className="inline-flex items-center gap-2 bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-sm"
        >
          View live sessions
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`rounded-sm border-l-4 ${stat.accent} shadow-none`}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-swadha-gray">{stat.title}</p>
                <p className="text-3xl font-heading font-bold text-swadha-dark mt-1">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 rounded-sm shadow-none">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold">Live sessions</h3>
            <Link to="/admin/sessions" className="text-xs font-bold uppercase tracking-wider text-swadha-orange">See all</Link>
          </div>
          <CardContent className="p-0">
            {liveSessions.length === 0 ? (
              <p className="p-6 text-sm text-swadha-gray">No students are checked in right now.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {liveSessions.map((session) => (
                  <li key={session.id} className="px-6 py-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-swadha-dark">{session.studentId}</p>
                      <p className="text-xs text-swadha-gray mt-0.5">
                        {session.machineId} · {session.purpose.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wide bg-green-50 text-swadha-greenDark px-2.5 py-1">
                      In use
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-sm shadow-none">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold">Open issues</h3>
            <Link to="/admin/issues" className="text-xs font-bold uppercase tracking-wider text-swadha-orange">Manage</Link>
          </div>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {mockIssues.map((issue) => (
                <li key={issue.id} className="px-6 py-4">
                  <p className="font-semibold text-sm text-swadha-dark capitalize">
                    {issue.issueType.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  <p className="text-xs text-swadha-gray mt-1">{issue.machineId} · {issue.studentId}</p>
                  <p className={`text-[11px] font-bold uppercase tracking-wide mt-2 ${
                    issue.status === IssueStatus.PENDING ? 'text-amber-600' : 'text-swadha-orange'
                  }`}>
                    {issue.status.replace(/_/g, ' ')}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg">Machine floor</h3>
          <Link to="/admin/machines" className="text-xs font-bold uppercase tracking-wider text-swadha-orange">Edit statuses</Link>
        </div>
        <div className="bg-white border border-black/5 p-5">
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-swadha-gray mb-4">
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-swadha-green" /> Available</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-swadha-orange" /> In use</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Maintenance</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {mockMachines.map(machine => {
              const tone =
                machine.status === MachineStatus.AVAILABLE ? 'bg-green-50 border-green-200 text-swadha-greenDark' :
                machine.status === MachineStatus.IN_USE ? 'bg-orange-50 border-orange-200 text-swadha-orange' :
                'bg-amber-50 border-amber-200 text-amber-700';
              return (
                <div key={machine.id} className={`border px-1 py-2.5 text-center ${tone}`}>
                  <Monitor className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] font-bold">{machine.id.replace('MACHINE-', 'M')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
