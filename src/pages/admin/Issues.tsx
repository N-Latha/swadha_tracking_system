import React, { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { Card, CardContent, Modal, Button, Select } from '../../components/ui';
import { mockIssues } from '../../services/mockData';
import { Issue, IssueStatus } from '../../types';

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Toast state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<IssueStatus>(IssueStatus.PENDING);
  const [actionTaken, setActionTaken] = useState('');
  const [showToast, setShowToast] = useState(false);

  const filteredIssues = issues.filter(issue => 
    issue.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setUpdateStatus(issue.status);
    setActionTaken(issue.actionTaken || '');
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedIssue) return;
    
    // Update local state
    setIssues(issues.map(issue => {
      if (issue.id === selectedIssue.id) {
        return {
          ...issue,
          status: updateStatus,
          actionTaken
        };
      }
      return issue;
    }));
    
    // In a real app, you would make an API call here.
    setIsModalOpen(false);
    
    // Show Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-8 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Issue updated successfully!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-swadha-gray">Student-reported problems waiting for staff action.</p>
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-swadha-dark text-white font-semibold">
                <tr>
                  <th className="px-6 py-4">Machine</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Reported At</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredIssues.map(issue => (
                  <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{issue.machineId}</td>
                    <td className="px-6 py-4 font-mono">{issue.studentId}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium capitalize">{issue.issueType.replace(/_/g, ' ').toLowerCase()}</div>
                      <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{issue.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(issue.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        issue.status === IssueStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                        issue.status === IssueStatus.WORKING_ON_ISSUE ? 'bg-orange-100 text-swadha-orange' :
                        issue.status === IssueStatus.RESOLVED ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {issue.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openUpdateModal(issue)}
                        className="text-swadha-orange font-medium hover:text-swadha-orangeDark transition-colors px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded-md"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No issues found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Details"
      >
        {selectedIssue && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="text-slate-500">Machine:</div>
              <div className="font-medium">{selectedIssue.machineId}</div>
              
              <div className="text-slate-500">Student:</div>
              <div className="font-medium">{selectedIssue.studentId}</div>
              
              <div className="text-slate-500">Issue:</div>
              <div className="font-medium capitalize">{selectedIssue.issueType.replace(/_/g, ' ').toLowerCase()}</div>
              
              <div className="text-slate-500">Reported:</div>
              <div className="font-medium">{new Date(selectedIssue.reportedAt).toLocaleTimeString()}</div>
            </div>
            
            <p className="text-sm text-slate-600 italic bg-white border border-slate-200 p-3 rounded-md">
              "{selectedIssue.description}"
            </p>

            <div className="pt-2 space-y-4">
              <Select
                label="Status"
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as IssueStatus)}
                options={[
                  { label: 'Pending', value: IssueStatus.PENDING },
                  { label: 'Working on Issue', value: IssueStatus.WORKING_ON_ISSUE },
                  { label: 'Resolved', value: IssueStatus.RESOLVED },
                  { label: 'Replacement Provided', value: IssueStatus.REPLACEMENT_PROVIDED },
                ]}
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-slate-700">Action Taken</label>
                <textarea
                  className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-swadha-orange focus:border-transparent min-h-[80px] resize-y"
                  placeholder="Describe action taken..."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                />
              </div>

              <Button onClick={handleUpdate} className="w-full mt-2">
                UPDATE
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
