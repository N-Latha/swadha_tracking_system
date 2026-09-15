import { Machine, MachineStatus, Session, Purpose, SessionStatus, Issue, IssueType, IssueStatus } from '../types';

export const mockMachines: Machine[] = Array.from({ length: 50 }, (_, i) => ({
  id: `MACHINE-${String(i + 1).padStart(3, '0')}`,
  status: i < 38 ? MachineStatus.AVAILABLE : 
          i < 48 ? MachineStatus.IN_USE : 
          MachineStatus.UNDER_MAINTENANCE
}));

export const mockSessions: Session[] = [
  {
    id: 'SESSION-001',
    studentId: 'SWD12345',
    machineId: 'MACHINE-001',
    purpose: Purpose.COLLEGE_PROJECT,
    startTime: new Date(Date.now() - 1000 * 60 * 84).toISOString(), // 84 minutes ago
    status: SessionStatus.ACTIVE
  },
  {
    id: 'SESSION-002',
    studentId: 'SWD98765',
    machineId: 'MACHINE-002',
    purpose: Purpose.SKILLING_COURSE,
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    status: SessionStatus.ACTIVE
  },
  {
    id: 'SESSION-003',
    studentId: 'SWD11223',
    machineId: 'MACHINE-010',
    purpose: Purpose.ZOOM_MEETING,
    startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), 
    exitTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration: 5400,
    status: SessionStatus.COMPLETED
  }
];

export const mockIssues: Issue[] = [
  {
    id: 'ISSUE-001',
    machineId: 'MACHINE-040',
    studentId: 'SWD33445',
    issueType: IssueType.SCREEN_FLICKERING,
    description: 'Screen flickers occasionally.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: IssueStatus.PENDING
  },
  {
    id: 'ISSUE-002',
    machineId: 'MACHINE-041',
    studentId: 'SWD99887',
    issueType: IssueType.NOT_SWITCHING_ON,
    description: 'Machine is completely dead.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: IssueStatus.WORKING_ON_ISSUE,
    actionTaken: 'Checked power supply, replacing cord.'
  }
];

export const mockUsageHistory: Session[] = [
    ...mockSessions
];
