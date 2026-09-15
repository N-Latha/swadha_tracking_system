import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { PageHero } from '../../components/PageHero';
import { Session } from '../../types';

export default function SessionCompleted() {
  const navigate = useNavigate();
  const location = useLocation();
  const [completedSession, setCompletedSession] = useState<Session | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Retrieve the completed session details
    const storedSessionStr = sessionStorage.getItem('currentSession');
    if (storedSessionStr) {
      setCompletedSession(JSON.parse(storedSessionStr));
      // Optionally, clear the session so they can't go back to the active state using the back button
      // But we will keep it for now to allow them to view this page if they refresh.
    }

    if (location.state?.issueReported) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  }, [location.state]);

  const handleBackToLogin = () => {
    sessionStorage.removeItem('currentSession');
    navigate('/student/login', { replace: true });
  };

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined) return 'N/A';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <PageHero title="Session Completed" subtitle="Thank you for using the common machine." />
      <section className="bg-swadha-light py-12 md:py-16 relative">
        {showToast && (
          <div className="fixed top-28 right-8 bg-swadha-green text-white px-4 py-3 rounded-sm shadow-lg flex items-center gap-3 z-50">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">The issue was submitted successfully!</span>
          </div>
        )}
        <div className="max-w-lg mx-auto px-4">
          <Card className="shadow-xl border-t-4 border-t-swadha-green rounded-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
            SESSION COMPLETED
          </CardTitle>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Your machine session has ended successfully.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          {completedSession ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-slate-500">Student ID</div>
                <div className="font-semibold text-right text-slate-900">{completedSession.studentId}</div>
                
                <div className="text-slate-500">Machine ID</div>
                <div className="font-semibold text-right text-slate-900">{completedSession.machineId}</div>
                
                <div className="text-slate-500">Purpose</div>
                <div className="font-semibold text-right text-slate-900 capitalize">
                  {completedSession.purpose.replace('_', ' ').toLowerCase()}
                </div>
                
                <div className="col-span-2 border-t border-slate-200 my-2"></div>
                
                <div className="text-slate-500">Start Time</div>
                <div className="font-semibold text-right text-slate-900">{formatTime(completedSession.startTime)}</div>
                
                <div className="text-slate-500">Exit Time</div>
                <div className="font-semibold text-right text-slate-900">{formatTime(completedSession.exitTime)}</div>
                
                <div className="text-slate-500 font-medium">Duration</div>
                <div className="font-bold text-right text-slate-900">{formatDuration(completedSession.duration)}</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center text-slate-500 text-sm">
              No session data available.
            </div>
          )}

          <p className="text-center text-sm text-slate-500 font-medium">
            Thank you for using the common machine.
          </p>

          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleBackToLogin}
          >
            <ArrowLeft className="w-5 h-5" />
            BACK TO LOGIN
          </Button>
        </CardContent>
      </Card>
        </div>
      </section>
    </>
  );
}
