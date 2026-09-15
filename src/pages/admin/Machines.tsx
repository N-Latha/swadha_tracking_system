import React, { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { Card, CardContent, Modal, Button, Select } from '../../components/ui';
import { mockMachines } from '../../services/mockData';
import { Machine, MachineStatus } from '../../types';

export default function AdminMachines() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal & Toast State
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<MachineStatus>(MachineStatus.AVAILABLE);
  const [showToast, setShowToast] = useState(false);

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || machine.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setUpdateStatus(machine.status);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedMachine) return;
    
    setMachines(machines.map(m => 
      m.id === selectedMachine.id ? { ...m, status: updateStatus } : m
    ));
    
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
          <span className="font-medium">Machine updated successfully!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-swadha-gray">Update availability, in-use, and maintenance status.</p>
      </div>

      <Card className="rounded-sm shadow-none">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Machine ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-swadha-orange"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-swadha-orange"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value={MachineStatus.AVAILABLE}>Available</option>
              <option value={MachineStatus.IN_USE}>In Use</option>
              <option value={MachineStatus.UNDER_MAINTENANCE}>Under Maintenance</option>
              <option value={MachineStatus.DISABLED}>Disabled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-swadha-dark text-white font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Machine ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMachines.map(machine => (
                  <tr key={machine.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{machine.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        machine.status === MachineStatus.AVAILABLE ? 'bg-green-100 text-green-700' :
                        machine.status === MachineStatus.IN_USE ? 'bg-orange-100 text-swadha-orange' :
                        machine.status === MachineStatus.UNDER_MAINTENANCE ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          machine.status === MachineStatus.AVAILABLE ? 'bg-green-500' :
                          machine.status === MachineStatus.IN_USE ? 'bg-swadha-orange' :
                          machine.status === MachineStatus.UNDER_MAINTENANCE ? 'bg-amber-500' :
                          'bg-slate-500'
                        }`}></span>
                        {machine.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openEditModal(machine)}
                        className="text-swadha-orange font-medium hover:text-swadha-orangeDark transition-colors px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded-md"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredMachines.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No machines found matching your filters.
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
        title="Edit Machine Status"
      >
        {selectedMachine && (
          <div className="space-y-4">
            <div className="text-sm bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Machine ID:</span>
              <span className="font-mono font-bold text-slate-800">{selectedMachine.id}</span>
            </div>
            
            <div className="pt-2 space-y-4">
              <Select
                label="Status"
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as MachineStatus)}
                options={[
                  { label: 'Available', value: MachineStatus.AVAILABLE },
                  { label: 'In Use', value: MachineStatus.IN_USE },
                  { label: 'Under Maintenance', value: MachineStatus.UNDER_MAINTENANCE },
                  { label: 'Disabled', value: MachineStatus.DISABLED },
                ]}
              />

              <Button onClick={handleUpdate} className="w-full mt-2">
                SAVE CHANGES
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
