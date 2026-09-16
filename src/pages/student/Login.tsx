import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Power, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Modal } from '../../components/ui';
import { PageHero } from '../../components/PageHero';
import { Purpose, Session } from '../../types';
import { sessionService } from '../../services/sessionService';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [purpose, setPurpose] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Read-only machine ID as per requirements
  const machineId = 'MACHINE-001';

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('currentSession');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.status === 'ACTIVE') {
          setActiveSession(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const purposeOptions = [
    { label: 'Skilling Course', value: Purpose.SKILLING_COURSE },
    { label: 'Zoom Meeting', value: Purpose.ZOOM_MEETING },
    { label: 'College Project', value: Purpose.COLLEGE_PROJECT },
    { label: 'Others', value: Purpose.OTHERS },
  ];

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!studentId.trim()) {
      setError('Please enter your Swadha ID.');
      return;
    }
    if (!purpose) {
      setError('Please select a purpose.');
      return;
    }

    setIsLoading(true);
    try {
      const session = await sessionService.startSession(studentId, machineId, purpose as Purpose);
      
      // Store session data locally for the frontend flow
      sessionStorage.setItem('currentSession', JSON.stringify(session));
      
      navigate('/student/session');
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEndSession = () => {
    setIsEndModalOpen(false);
    navigate('/student/condition');
  };

  return (
    <>
      <PageHero
        title="Student Check-in"
        subtitle="Please check in to start your common machine session."
      />
      <section className="bg-swadha-light py-12 md:py-16">
        <div className="max-w-md mx-auto px-4 space-y-6">
          {/* Active Session Warning Banner */}
          {activeSession && (
            <div className="bg-white border-2 border-emerald-500 rounded-sm shadow-md p-5">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Active Session Detected
              </div>
              <p className="text-sm text-slate-700 font-medium">
                Student <span className="font-bold text-slate-900">{activeSession.studentId}</span> is currently logged into <span className="font-bold text-slate-900">{activeSession.machineId}</span>.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <Button
                  type="button"
                  onClick={() => navigate('/student/session')}
                  className="flex-1 bg-swadha-green hover:bg-swadha-greenDark text-white text-xs gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  Resume Session
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsEndModalOpen(true)}
                  className="flex-1 text-xs gap-1.5"
                >
                  <Power className="w-4 h-4" />
                  End Session
                </Button>
              </div>
            </div>
          )}

          <Card className="shadow-xl border-t-4 border-t-swadha-green rounded-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-swadha-dark tracking-tight">
                COMMON MACHINE
                <span className="block text-swadha-orange font-extrabold text-3xl mt-1">USAGE PORTAL</span>
              </CardTitle>
              <p className="text-slate-500 mt-2 text-sm">Enter your Swadha ID to begin.</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleStartSession} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Machine ID"
              value={machineId}
              disabled
              className="bg-slate-100 font-mono text-slate-600 cursor-not-allowed"
            />
            
            <Input
              label="Swadha ID / Student ID"
              placeholder="Enter your Swadha ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
              autoComplete="off"
            />
            
            <Select
              label="Purpose of Usage"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              options={purposeOptions}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? 'Starting Session...' : 'START SESSION'}
            </Button>
          </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Confirmation Modal for Ending Session */}
      <Modal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        title="End Machine Session?"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to end active session on <strong className="text-slate-900">{activeSession?.machineId}</strong>?
          You will proceed to confirm machine condition before you can log in again.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsEndModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmEndSession} className="gap-2">
            <Power className="w-4 h-4" />
            End Session
          </Button>
        </div>
      </Modal>
    </>
  );
}
