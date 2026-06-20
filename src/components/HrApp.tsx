import React, { useState } from 'react';
import { Users, UserPlus, Briefcase, Calendar, ShieldCheck, Mail, CheckCircle, Search } from 'lucide-react';
import { cn } from '../utils';

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  status: 'active' | 'on_leave' | 'onboarding';
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Walker', jobTitle: 'Software Engineer', department: 'Engineering', email: 'alice.walker@example.com', status: 'active' },
  { id: '2', name: 'David Smith', jobTitle: 'Product Manager', department: 'Product', email: 'david.smith@example.com', status: 'on_leave' },
  { id: '3', name: 'Sarah Jones', jobTitle: 'HR Specialist', department: 'Human Resources', email: 'sarah.jones@example.com', status: 'active' },
  { id: '4', name: 'Michael Chen', jobTitle: 'Marketing Director', department: 'Marketing', email: 'michael.chen@example.com', status: 'onboarding' },
];

export default function HrApp() {
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<'employees' | 'recruitment'>('employees');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      {/* Top Navbar */}
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-pink-600 text-white p-2 rounded-lg shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#3B3B3B]">Human Resources</h1>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('employees')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'employees' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Employees
            </button>
            <button 
              onClick={() => setActiveTab('recruitment')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'recruitment' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Recruitment
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
            New Employee
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'employees' ? (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded">Filter</button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded">Group By</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {employees.map(emp => (
                <div key={emp.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-16 bg-gradient-to-r from-pink-50 to-rose-50 flex items-start justify-end p-2">
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                      emp.status === 'active' ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                      emp.status === 'onboard' ? "bg-amber-50 border-amber-200 text-amber-700" :
                      "bg-blue-50 border-blue-200 text-blue-700"
                    )}>
                      {emp.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="px-4 py-3 relative flex-1 flex flex-col">
                    <div className="absolute -top-10 left-4 w-16 h-16 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                      <div className="w-full h-full bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold text-xl">
                        {emp.name.charAt(0)}
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-gray-900 font-bold text-base truncate">{emp.name}</h3>
                      <p className="text-emerald-700 text-sm font-medium truncate mb-2">{emp.jobTitle}</p>
                      
                      <div className="space-y-1.5 mt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{emp.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-medium text-lg mb-1">Recruitment Pipeline</h3>
              <p className="text-gray-500 text-sm mb-4">You have no active job positions published.</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                Create Job Position
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
