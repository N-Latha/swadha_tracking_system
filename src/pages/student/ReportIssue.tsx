import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select } from '../../components/ui';
import { PageHero } from '../../components/PageHero';
import { IssueType } from '../../types';
import { sessionService } from '../../services/sessionService';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const issueOptions = [
    { label: 'Not Switching ON', value: IssueType.NOT_SWITCHING_ON },
    { label: 'Screen Flickering', value: IssueType.SCREEN_FLICKERING },
    { label: 'Hanging', value: IssueType.HANGING },
    { label: 'Application Not Opening', value: IssueType.APPLICATION_NOT_OPENING },
    { label: 'Wi-Fi Not Connecting', value: IssueType.WIFI_NOT_CONNECTING },
    { label: 'Keypad Malfunction', value: IssueType.KEYPAD_MALFUNCTION },
    { label: 'Mouse Malfunction', value: IssueType.MOUSE_MALFUNCTION },
    { label: 'Battery Issue', value: IssueType.BATTERY_ISSUE },
    { label: 'Overheating', value: IssueType.OVERHEATING },
    { label: 'Noise Coming', value: IssueType.NOISE_COMING },
    { label: 'Other', value: IssueType.OTHER },
  ];

  const isOther = issueType === IssueType.OTHER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!issueType) {
      setError('Please select an issue type.');
      return;
    }

    if (isOther && !description.trim()) {
      setError('Please provide a description for the issue.');
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, we would call an issue reporting endpoint here
      // For now, we simulate ending the session with an issue flag
      
      const storedSessionStr = sessionStorage.getItem('currentSession');
      if (storedSessionStr) {
        const session = JSON.parse(storedSessionStr);
        // Simulate backend end session
        let completedSession;
        try {
            completedSession = await sessionService.endSession(session.id);
        } catch (err) {
            // mock fallback
            completedSession = { ...session };
            completedSession.exitTime = new Date().toISOString();
            completedSession.duration = Math.floor((new Date(completedSession.exitTime).getTime() - new Date(completedSession.startTime).getTime()) / 1000);
            completedSession.status = 'COMPLETED';
        }
        
        sessionStorage.setItem('currentSession', JSON.stringify(completedSession));
      }
      
      navigate('/student/completed', { state: { issueReported: true } });
    } catch (err: any) {
      setError('Unable to submit issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero title="Report an Issue" subtitle="Tell us what went wrong so the machine can be repaired quickly." />
      <section className="bg-swadha-light py-12 md:py-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl border-t-4 border-t-amber-500 rounded-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto bg-amber-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
            REPORT MACHINE ISSUE
          </CardTitle>
          <p className="text-slate-500 mt-2 text-sm">
            Please let us know what went wrong with the machine.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Select
              label="Issue Type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              options={issueOptions}
            />
            
            {/* Show description field if 'Other' is selected, or let it be optional for predefined ones */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-slate-700">
                Description {isOther ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
              </label>
              <textarea
                className={`flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px] resize-y ${isOther && !description.trim() && error ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? 'Submitting Issue...' : 'SUBMIT & EXIT'}
            </Button>
          </form>
        </CardContent>
      </Card>
        </div>
      </section>
    </>
  );
}
