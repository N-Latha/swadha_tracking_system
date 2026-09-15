import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { PageHero } from '../../components/PageHero';
import { sessionService } from '../../services/sessionService';

export default function MachineCondition() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNoIssues = async () => {
    setIsLoading(true);
    try {
      const storedSessionStr = sessionStorage.getItem('currentSession');
      if (storedSessionStr) {
        const session = JSON.parse(storedSessionStr);
        const completedSession = await sessionService.endSession(session.id);
        
        // Update stored session with completion data
        sessionStorage.setItem('currentSession', JSON.stringify(completedSession));
      }
      
      // Navigate to completed screen
      navigate('/student/completed');
    } catch (error) {
      console.error("Failed to complete session", error);
      // Fallback for mock environment when state might be lost
      const storedSessionStr = sessionStorage.getItem('currentSession');
      if (storedSessionStr) {
          const session = JSON.parse(storedSessionStr);
          session.exitTime = new Date().toISOString();
          session.duration = Math.floor((new Date(session.exitTime).getTime() - new Date(session.startTime).getTime()) / 1000);
          session.status = 'COMPLETED';
          sessionStorage.setItem('currentSession', JSON.stringify(session));
      }
      // Navigate to completed screen
      navigate('/student/completed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIssue = () => {
    navigate('/student/report-issue');
  };

  return (
    <>
      <PageHero title="Session Exit" subtitle="Please confirm the condition of the machine before you leave." />
      <section className="bg-swadha-light py-12 md:py-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl border-t-4 border-t-swadha-dark rounded-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            Session Exit
          </CardTitle>
          <p className="text-slate-500 mt-2 font-medium">
            Did you face any issue with this machine?
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-2 hover:border-green-500 hover:bg-green-50 transition-all text-slate-700 hover:text-green-700"
            onClick={handleNoIssues}
            isLoading={isLoading}
          >
            {!isLoading && <CheckCircle2 className="w-8 h-8 text-green-500" />}
            <span className="font-bold text-lg">
              {isLoading ? 'Completing Session...' : 'NO ISSUES'}
            </span>
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-2 hover:border-amber-500 hover:bg-amber-50 transition-all text-slate-700 hover:text-amber-700"
            onClick={handleReportIssue}
            disabled={isLoading}
          >
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="font-bold text-lg">REPORT AN ISSUE</span>
          </Button>
        </CardContent>
      </Card>
        </div>
      </section>
    </>
  );
}
