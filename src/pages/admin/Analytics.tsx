import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { mockUsageHistory, mockIssues } from '../../services/mockData';
import { IssueStatus } from '../../types';

export default function AdminAnalytics() {
  
  // Prepare data for charts based on mockUsageHistory
  const purposeCounts: Record<string, number> = {};
  mockUsageHistory.forEach(session => {
    purposeCounts[session.purpose] = (purposeCounts[session.purpose] || 0) + 1;
  });

  const purposeData = Object.keys(purposeCounts).map(key => ({
    name: key.replace('_', ' ').toLowerCase(),
    value: purposeCounts[key]
  }));

  const COLORS = ['#F26F2B', '#87C54B', '#2EA3F2', '#f59e0b', '#2F2F2F'];

  const issueStatusCounts: Record<string, number> = {
    'PENDING': 0, 'WORKING_ON_ISSUE': 0, 'RESOLVED': 0, 'REPLACEMENT_PROVIDED': 0
  };
  mockIssues.forEach(issue => {
    issueStatusCounts[issue.status]++;
  });

  const issueData = Object.keys(issueStatusCounts).map(key => ({
    name: key.replace(/_/g, ' '),
    count: issueStatusCounts[key]
  })).filter(d => d.count > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-swadha-gray">How students use machines, and how issues are moving.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-sm shadow-none">
          <CardHeader>
            <CardTitle>Usage by Purpose</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  className="capitalize text-sm"
                >
                  {purposeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend className="capitalize" formatter={(value) => <span className="capitalize">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-sm shadow-none">
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={issueData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  interval={0}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <RechartsTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#F26F2B" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
