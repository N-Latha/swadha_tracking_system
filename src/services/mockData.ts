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
  },
  {
    id: 'SESSION-004',
    studentId: 'SWD44556',
    machineId: 'MACHINE-003',
    purpose: Purpose.SKILLING_COURSE,
    startTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: SessionStatus.ACTIVE
  },
  {
    id: 'SESSION-005',
    studentId: 'SWD77889',
    machineId: 'MACHINE-015',
    purpose: Purpose.OTHERS,
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: SessionStatus.ACTIVE
  }
];

export const mockIssues: Issue[] = [
  {
    id: 'ISSUE-001',
    machineId: 'MACHINE-040',
    studentId: 'SWD33445',
    issueType: IssueType.SCREEN_FLICKERING,
    description: 'Screen flickers occasionally when moved.',
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
  },
  {
    id: 'ISSUE-003',
    machineId: 'MACHINE-007',
    studentId: 'SWD12345',
    issueType: IssueType.KEYPAD_MALFUNCTION,
    description: 'Spacebar and enter key sticky.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: IssueStatus.RESOLVED,
    actionTaken: 'Cleaned and replaced keycaps.'
  },
  {
    id: 'ISSUE-004',
    machineId: 'MACHINE-012',
    studentId: 'SWD55443',
    issueType: IssueType.MOUSE_MALFUNCTION,
    description: 'Right click not responding.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: IssueStatus.REPLACEMENT_PROVIDED,
    actionTaken: 'Replaced with optical mouse.'
  },
  {
    id: 'ISSUE-005',
    machineId: 'MACHINE-019',
    studentId: 'SWD66778',
    issueType: IssueType.WIFI_NOT_CONNECTING,
    description: 'Cannot connect to lab WiFi.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: IssueStatus.RESOLVED,
    actionTaken: 'Updated wireless network drivers.'
  },
  {
    id: 'ISSUE-006',
    machineId: 'MACHINE-040',
    studentId: 'SWD22334',
    issueType: IssueType.OVERHEATING,
    description: 'Fan noisy and shuts down after 30 mins.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    status: IssueStatus.WORKING_ON_ISSUE,
    actionTaken: 'Thermal paste re-applied.'
  }
];

// Helper to generate realistic historical session records
const generateHistoricalSessions = (): Session[] => {
  const purposes = [
    Purpose.SKILLING_COURSE, 
    Purpose.SKILLING_COURSE, 
    Purpose.COLLEGE_PROJECT, 
    Purpose.ZOOM_MEETING, 
    Purpose.OTHERS
  ];
  const students = [
    'SWD12345', 'SWD98765', 'SWD11223', 'SWD44556', 'SWD77889',
    'SWD33445', 'SWD99887', 'SWD55443', 'SWD66778', 'SWD22334',
    'SWD88990', 'SWD33221', 'SWD66554', 'SWD44332', 'SWD77112'
  ];

  const sessions: Session[] = [...mockSessions];
  
  // Create ~60 realistic completed sessions spread over past 30 days
  for (let i = 1; i <= 60; i++) {
    const daysAgo = Math.floor(i / 2);
    const hour = 9 + (i % 10); // 9am - 6pm
    const durationMinutes = 30 + (i * 7) % 110; // 30 to 140 minutes
    const startTime = new Date(Date.now() - daysAgo * 86400000);
    startTime.setHours(hour, (i * 13) % 60, 0, 0);
    const exitTime = new Date(startTime.getTime() + durationMinutes * 60000);

    sessions.push({
      id: `HIST-SESSION-${String(i).padStart(3, '0')}`,
      studentId: students[i % students.length],
      machineId: `MACHINE-${String((i % 25) + 1).padStart(3, '0')}`,
      purpose: purposes[i % purposes.length],
      startTime: startTime.toISOString(),
      exitTime: exitTime.toISOString(),
      duration: durationMinutes * 60,
      status: SessionStatus.COMPLETED
    });
  }

  return sessions;
};

export const mockUsageHistory: Session[] = generateHistoricalSessions();
