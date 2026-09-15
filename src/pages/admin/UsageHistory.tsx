import React, { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { mockUsageHistory } from '../../services/mockData';

export default function AdminUsageHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = mockUsageHistory.filter(session => 
    session.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined) return '-';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-swadha-gray">Completed and ongoing check-ins across machines.</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-swadha-orange text-white hover:bg-swadha-orangeDark rounded-sm transition-colors font-bold uppercase tracking-wider text-xs">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <Card className="rounded-sm shadow-none">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Machine or Student ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-swadha-orange"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm sm:w-auto w-full">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-swadha-dark text-white font-semibold">
                <tr>
                  <th className="px-6 py-4">Machine ID</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Start Time</th>
                  <th className="px-6 py-4">Exit Time</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredHistory.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{session.machineId}</td>
                    <td className="px-6 py-4 font-mono">{session.studentId}</td>
                    <td className="px-6 py-4 capitalize">{session.purpose.replace('_', ' ').toLowerCase()}</td>
                    <td className="px-6 py-4">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {session.exitTime ? new Date(session.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
