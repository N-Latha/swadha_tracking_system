import { Purpose, Session, SessionStatus } from '../types';
import { mockSessions, mockMachines } from './mockData';

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sessionService = {
  async startSession(studentId: string, machineId: string, purpose: Purpose): Promise<Session> {
    await delay(800);
    
    // In a real app, this would be a POST request and would validate backend state
    const machine = mockMachines.find(m => m.id === machineId);
    if (!machine) {
        throw new Error('Machine not found');
    }
    if (machine.status !== 'AVAILABLE') {
        throw new Error('Machine is currently unavailable or in use');
    }
    
    const newSession: Session = {
      id: `SESSION-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      studentId,
      machineId,
      purpose,
      startTime: new Date().toISOString(),
      status: SessionStatus.ACTIVE
    };
    
    // Mock state update
    mockSessions.push(newSession);
    machine.status = 'IN_USE' as any;
    
    return newSession;
  },

  async endSession(sessionId: string): Promise<Session> {
    await delay(800);
    
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session) {
        throw new Error('Session not found');
    }
    
    session.exitTime = new Date().toISOString();
    session.duration = Math.floor((new Date(session.exitTime).getTime() - new Date(session.startTime).getTime()) / 1000);
    session.status = SessionStatus.COMPLETED;
    
    const machine = mockMachines.find(m => m.id === session.machineId);
    if (machine) {
        machine.status = 'AVAILABLE' as any;
    }
    
    return session;
  },
  
  async getActiveSession(studentId: string): Promise<Session | null> {
      await delay(400);
      return mockSessions.find(s => s.studentId === studentId && s.status === SessionStatus.ACTIVE) || null;
  }
};
