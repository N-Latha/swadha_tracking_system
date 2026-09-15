import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, User, Monitor, Clock, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Modal } from '../../components/ui';
import { PageHero } from '../../components/PageHero';
import { SessionTimer } from '../../components/SessionTimer';
import { Session } from '../../types';

export default function ActiveSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be a check against the backend
    const storedSession = sessionStorage.getItem('currentSession');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      // If no active session, redirect to login
      navigate('/student/login', { replace: true });
    }
  }, [navigate]);

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    // Proceed to condition check screen
    navigate('/student/condition');
  };

  if (!session) return null;

  return (
    <>
      <PageHero title="Active Session" subtitle="Your common machine is currently in use." />
      <section className="bg-swadha-light py-12 md:py-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl border-t-4 border-t-swadha-green rounded-sm">
        <CardHeader className="text-center pb-2">
          <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4">Active Session</h2>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            MACHINE IN USE
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-3 text-slate-600">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium w-24 text-sm">Student ID</span>
              <span className="font-semibold text-slate-900">{session.studentId}</span>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600">
              <Monitor className="w-5 h-5 text-slate-400" />
              <span className="font-medium w-24 text-sm">Machine ID</span>
              <span className="font-semibold text-slate-900">{session.machineId}</span>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600">
              <PlayCircle className="w-5 h-5 text-slate-400" />
              <span className="font-medium w-24 text-sm">Purpose</span>
              <span className="font-semibold text-slate-900 capitalize">
                {session.purpose.replace('_', ' ').toLowerCase()}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="font-medium w-24 text-sm">Started At</span>
              <span className="font-semibold text-slate-900">
                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="text-center py-6">
            <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Session Duration</p>
            <SessionTimer startTime={session.startTime} />
          </div>

          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full gap-2 text-base font-semibold"
            onClick={() => setIsModalOpen(true)}
          >
            <Power className="w-5 h-5" />
            EXIT SESSION
          </Button>
        </CardContent>
      </Card>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="End Session?"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to end your machine session? 
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmExit}>
            Exit Session
          </Button>
        </div>
      </Modal>
    </>
  );
}
