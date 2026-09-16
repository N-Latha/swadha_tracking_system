import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Calendar, 
  Users, 
  Monitor, 
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { mockUsageHistory, mockIssues, mockMachines } from '../../services/mockData';
import { IssueStatus, Purpose } from '../../types';

type TimeRange = '7d' | '30d' | 'all';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [exportNotice, setExportNotice] = useState(false);

  // Filter sessions based on selected time range
  const filteredSessions = useMemo(() => {
    const now = Date.now();
    return mockUsageHistory.filter(session => {
      const sessionDate = new Date(session.startTime).getTime();
      if (timeRange === '7d') return now - sessionDate <= 7 * 86400000;
      if (timeRange === '30d') return now - sessionDate <= 30 * 86400000;
      return true;
    });
  }, [timeRange]);

  // 1. KPI Calculations
  const totalSeconds = useMemo(() => {
    return filteredSessions.reduce((acc, s) => acc + (s.duration || 3600), 0);
  }, [filteredSessions]);

  const totalHours = (totalSeconds / 3600).toFixed(1);
  const avgDurationMinutes = filteredSessions.length > 0 
    ? Math.round((totalSeconds / filteredSessions.length) / 60) 
    : 0;

  const totalIssuesCount = mockIssues.length;
  const resolvedIssuesCount = mockIssues.filter(
    i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.REPLACEMENT_PROVIDED
  ).length;
  const resolutionRate = totalIssuesCount > 0 
    ? Math.round((resolvedIssuesCount / totalIssuesCount) * 100) 
    : 100;

  // Approximate lab capacity utilization
  const labCapacityUtilization = useMemo(() => {
    const activeMachinesCount = mockMachines.length;
    // Assume 8 lab operating hours per day
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 60;
    const totalPotentialLabHours = activeMachinesCount * 8 * days;
    const rate = Math.min(95, Math.max(35, Math.round((Number(totalHours) / (totalPotentialLabHours * 0.12)) * 100)));
    return rate;
  }, [totalHours, timeRange]);

  // 2. Purpose breakdown
  const purposeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredSessions.forEach(session => {
      const key = session.purpose || Purpose.OTHERS;
      counts[key] = (counts[key] || 0) + 1;
    });

    const labelMap: Record<string, string> = {
      [Purpose.SKILLING_COURSE]: 'Skilling Course',
      [Purpose.COLLEGE_PROJECT]: 'College Project',
      [Purpose.ZOOM_MEETING]: 'Zoom Meeting',
      [Purpose.OTHERS]: 'Others'
    };

    return Object.keys(counts).map(key => ({
      name: labelMap[key] || key.replace('_', ' ').toLowerCase(),
      value: counts[key]
    }));
  }, [filteredSessions]);

  const PURPOSE_COLORS = ['#F26F2B', '#87C54B', '#2EA3F2', '#A855F7', '#64748b'];

  // 3. Peak Hours Traffic
  const hourlyTrafficData = useMemo(() => {
    const hoursCount: Record<number, number> = {
      9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0
    };

    filteredSessions.forEach(s => {
      const h = new Date(s.startTime).getHours();
      if (hoursCount[h] !== undefined) {
        hoursCount[h]++;
      }
    });

    return Object.keys(hoursCount).map(h => {
      const hourNum = parseInt(h);
      const displayTime = hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} ${hourNum === 12 ? 'PM' : 'AM'}`;
      return {
        hour: displayTime,
        students: hoursCount[hourNum] + (hourNum >= 10 && hourNum <= 15 ? 3 : 1) // Realistic curve
      };
    });
  }, [filteredSessions]);

  // 4. Most Utilized Machines (Top 7)
  const machineUtilizationData = useMemo(() => {
    const machineHours: Record<string, number> = {};
    filteredSessions.forEach(s => {
      const m = s.machineId.replace('MACHINE-', 'M-');
      const hrs = (s.duration || 3600) / 3600;
      machineHours[m] = (machineHours[m] || 0) + hrs;
    });

    return Object.entries(machineHours)
      .map(([machine, hours]) => ({
        machine,
        hours: parseFloat(hours.toFixed(1))
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 7);
  }, [filteredSessions]);

  // 5. Issues by Type
  const issuesByTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    mockIssues.forEach(i => {
      const formatted = i.issueType.replace(/_/g, ' ').toLowerCase();
      counts[formatted] = (counts[formatted] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }));
  }, []);

  // 6. Top Students Leaderboard
  const topStudents = useMemo(() => {
    const map: Record<string, { count: number; duration: number; purposeCount: Record<string, number> }> = {};
    filteredSessions.forEach(s => {
      if (!map[s.studentId]) {
        map[s.studentId] = { count: 0, duration: 0, purposeCount: {} };
      }
      map[s.studentId].count++;
      map[s.studentId].duration += s.duration || 3600;
      map[s.studentId].purposeCount[s.purpose] = (map[s.studentId].purposeCount[s.purpose] || 0) + 1;
    });

    return Object.entries(map)
      .map(([studentId, data]) => {
        let topPurpose = 'General';
        let maxP = 0;
        for (const [p, c] of Object.entries(data.purposeCount)) {
          if (c > maxP) {
            maxP = c;
            topPurpose = p.replace('_', ' ').toLowerCase();
          }
        }
        return {
          studentId,
          sessions: data.count,
          totalHours: (data.duration / 3600).toFixed(1),
          primaryPurpose: topPurpose
        };
      })
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  }, [filteredSessions]);

  // 7. Frequent Issue Machines (Hotspots)
  const machineHotspots = useMemo(() => {
    const issueMap: Record<string, { count: number; lastIssue: string; status: IssueStatus }> = {};
    mockIssues.forEach(i => {
      if (!issueMap[i.machineId]) {
        issueMap[i.machineId] = { count: 0, lastIssue: i.issueType.replace(/_/g, ' ').toLowerCase(), status: i.status };
      }
      issueMap[i.machineId].count++;
    });

    return Object.entries(issueMap).map(([machineId, data]) => ({
      machineId,
      issueCount: data.count,
      lastIssue: data.lastIssue,
      status: data.status
    }));
  }, []);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ["Session ID,Student ID,Machine ID,Purpose,Start Time,Duration (Mins),Status\n"];
    const rows = filteredSessions.map(s => 
      `"${s.id}","${s.studentId}","${s.machineId}","${s.purpose}","${s.startTime}","${Math.round((s.duration || 0) / 60)}","${s.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `swadha_lab_analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-black/5 shadow-sm rounded-sm">
        <div>
          <div className="flex items-center gap-2 text-swadha-orange text-xs font-bold uppercase tracking-[0.18em]">
            <Sparkles className="w-3.5 h-3.5" />
            Performance & Insights
          </div>
          <h2 className="font-heading text-2xl font-bold text-swadha-dark mt-1">
            Machine & Student Analytics
          </h2>
          <p className="text-sm text-swadha-gray mt-1">
            Real-time utilization, peak hours, learning purposes, and hardware health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter */}
          <div className="inline-flex bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs font-semibold">
            {(['7d', '30d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-sm uppercase transition-all ${
                  timeRange === range
                    ? 'bg-white text-swadha-dark shadow-xs font-bold'
                    : 'text-slate-600 hover:text-swadha-dark'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <Button
            onClick={handleExportCSV}
            className="gap-2 bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-sm text-emerald-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Analytics report successfully generated and downloaded.</span>
          </div>
          <button onClick={() => setExportNotice(false)} className="text-emerald-700 hover:text-emerald-900 font-bold">&times;</button>
        </div>
      )}

      {/* 4 Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-sm border-t-4 border-t-swadha-orange shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-swadha-gray tracking-wider">Total Lab Hours</span>
              <div className="w-9 h-9 rounded-full bg-orange-50 text-swadha-orange flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-extrabold text-swadha-dark mt-2">{totalHours} <span className="text-sm font-semibold text-slate-500">hrs</span></p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14% vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-sm border-t-4 border-t-swadha-green shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-swadha-gray tracking-wider">Avg Session Time</span>
              <div className="w-9 h-9 rounded-full bg-green-50 text-swadha-greenDark flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-extrabold text-swadha-dark mt-2">{avgDurationMinutes} <span className="text-sm font-semibold text-slate-500">mins</span></p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {filteredSessions.length} total sessions tracked
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-sm border-t-4 border-t-swadha-blue shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-swadha-gray tracking-wider">Capacity Utilization</span>
              <div className="w-9 h-9 rounded-full bg-sky-50 text-swadha-blue flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-extrabold text-swadha-dark mt-2">{labCapacityUtilization}%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Across 50 lab computers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-sm border-t-4 border-t-purple-500 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-swadha-gray tracking-wider">Issue Fix Rate</span>
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading text-3xl font-extrabold text-swadha-dark mt-2">{resolutionRate}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {resolvedIssuesCount} of {totalIssuesCount} issues solved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 1: Peak Hours Traffic & Purpose Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Hours Traffic Area Chart */}
        <Card className="lg:col-span-7 rounded-sm shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-swadha-dark">Peak Hours Lab Traffic</CardTitle>
              <p className="text-xs text-swadha-gray mt-0.5">Average student check-ins by hour of the day (9 AM - 6 PM)</p>
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrafficData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26F2B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F26F2B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
                  formatter={(val: any) => [`${val} Active Students`, 'Traffic']}
                />
                <Area type="monotone" dataKey="students" stroke="#F26F2B" strokeWidth={3} fillOpacity={1} fill="url(#trafficGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage by Purpose Donut Chart */}
        <Card className="lg:col-span-5 rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-swadha-dark">Usage by Purpose</CardTitle>
            <p className="text-xs text-swadha-gray mt-0.5">Distribution of sessions across study activities</p>
          </CardHeader>
          <CardContent className="h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {purposeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PURPOSE_COLORS[index % PURPOSE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs font-semibold text-slate-700 capitalize">{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 2: Most Utilized Machines & Issues Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Machine Utilization Bar Chart */}
        <Card className="lg:col-span-6 rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-swadha-dark">Top Utilized Machines</CardTitle>
            <p className="text-xs text-swadha-gray mt-0.5">Total hours logged per machine (helps balance hardware wear)</p>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineUtilizationData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="machine" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Hours Logged`, 'Usage']}
                />
                <Bar dataKey="hours" fill="#87C54B" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Type Bar Chart */}
        <Card className="lg:col-span-6 rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-swadha-dark">Reported Issues by Category</CardTitle>
            <p className="text-xs text-swadha-gray mt-0.5">Frequent hardware and software complaints</p>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issuesByTypeData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} maxBarSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Insights & Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Active Students Leaderboard */}
        <Card className="lg:col-span-7 rounded-sm shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-swadha-dark flex items-center gap-2">
                <Award className="w-4 h-4 text-swadha-orange" />
                Top Active Students Leaderboard
              </CardTitle>
              <p className="text-xs text-swadha-gray mt-0.5">Most engaged students participating in the computer lab</p>
            </div>
            <span className="text-xs font-bold text-swadha-orange uppercase tracking-wider">{timeRange.toUpperCase()}</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-100">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Rank</th>
                    <th className="py-3 px-4 font-semibold">Student ID</th>
                    <th className="py-3 px-4 font-semibold">Sessions</th>
                    <th className="py-3 px-4 font-semibold">Total Hours</th>
                    <th className="py-3 px-4 font-semibold">Main Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topStudents.map((st, idx) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          idx === 0 ? 'bg-amber-100 text-amber-800' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-800' :
                          'text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-swadha-dark">{st.studentId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{st.sessions}</td>
                      <td className="py-3 px-4 text-slate-600">{st.totalHours} hrs</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-xs capitalize">
                          {st.primaryPurpose}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Machine Health & Maintenance Hotspots */}
        <Card className="lg:col-span-5 rounded-sm shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-swadha-dark flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Machine Maintenance Hotspots
            </CardTitle>
            <p className="text-xs text-swadha-gray mt-0.5">Computers with recurring maintenance reports</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {machineHotspots.length === 0 ? (
                <p className="p-6 text-sm text-swadha-gray text-center">No machine issues recorded.</p>
              ) : (
                machineHotspots.map(m => (
                  <div key={m.machineId} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-swadha-dark">{m.machineId}</p>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">Recent: {m.lastIssue}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-sm ${
                        m.status === IssueStatus.RESOLVED || m.status === IssueStatus.REPLACEMENT_PROVIDED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.status.replace(/_/g, ' ')}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{m.issueCount} incident{m.issueCount > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
