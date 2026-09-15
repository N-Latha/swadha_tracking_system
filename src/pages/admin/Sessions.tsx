import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { mockSessions } from '../../services/mockData';
import { Session, SessionStatus } from '../../types';
import { SessionTimer } from '../../components/SessionTimer';

export default function AdminSessions() {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSessions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setActiveSessions(mockSessions.filter(s => s.status === SessionStatus.ACTIVE));
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-swadha-gray">Students currently checked in to a common machine.</p>
        <button 
          onClick={fetchSessions}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <Card className="rounded-sm shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-swadha-dark text-white font-semibold">
                <tr>
                  <th className="px-6 py-4">Machine ID</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Start Time</th>
                  <th className="px-6 py-4">Live Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeSessions.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-swadha-orange">{session.machineId}</td>
                    <td className="px-6 py-4 font-mono">{session.studentId}</td>
                    <td className="px-6 py-4 capitalize">{session.purpose.replace('_', ' ').toLowerCase()}</td>
                    <td className="px-6 py-4">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      <div className="scale-75 origin-left -my-2">
                         <SessionTimer startTime={session.startTime} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        IN USE
                      </span>
                    </td>
                  </tr>
                ))}
                
                {activeSessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No active sessions at the moment.
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
