export enum Purpose {
  SKILLING_COURSE = 'SKILLING_COURSE',
  ZOOM_MEETING = 'ZOOM_MEETING',
  COLLEGE_PROJECT = 'COLLEGE_PROJECT',
  OTHERS = 'OTHERS'
}

export enum MachineStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  DISABLED = 'DISABLED'
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum IssueType {
  NOT_SWITCHING_ON = 'NOT_SWITCHING_ON',
  SCREEN_FLICKERING = 'SCREEN_FLICKERING',
  HANGING = 'HANGING',
  APPLICATION_NOT_OPENING = 'APPLICATION_NOT_OPENING',
  WIFI_NOT_CONNECTING = 'WIFI_NOT_CONNECTING',
  KEYPAD_MALFUNCTION = 'KEYPAD_MALFUNCTION',
  MOUSE_MALFUNCTION = 'MOUSE_MALFUNCTION',
  BATTERY_ISSUE = 'BATTERY_ISSUE',
  OVERHEATING = 'OVERHEATING',
  NOISE_COMING = 'NOISE_COMING',
  OTHER = 'OTHER'
}

export enum IssueStatus {
  PENDING = 'PENDING',
  WORKING_ON_ISSUE = 'WORKING_ON_ISSUE',
  RESOLVED = 'RESOLVED',
  REPLACEMENT_PROVIDED = 'REPLACEMENT_PROVIDED'
}

export interface Student {
  id: string; // e.g., SWD12345
  name?: string;
}

export interface Machine {
  id: string; // e.g., MACHINE-001
  status: MachineStatus;
}

export interface Session {
  id: string;
  studentId: string;
  machineId: string;
  purpose: Purpose;
  startTime: string; // ISO string
  exitTime?: string; // ISO string
  duration?: number; // in seconds
  status: SessionStatus;
}

export interface Issue {
  id: string;
  sessionId?: string; // Links issue to a specific session if reported during exit
  machineId: string;
  studentId: string;
  issueType: IssueType;
  description: string;
  reportedAt: string; // ISO string
  status: IssueStatus;
  actionTaken?: string;
}

export interface DashboardStats {
  totalMachines: number;
  available: number;
  inUse: number;
  underMaintenance: number;
  activeSessions: number;
  issuesReportedToday: number;
}
