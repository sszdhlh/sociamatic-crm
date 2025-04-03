import { useState } from 'react';
import { WrenchScrewdriverIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type TechnicalReviewCardProps = {
  issueCount: number;
};

export default function TechnicalReviewCard({ issueCount }: TechnicalReviewCardProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [issues, setIssues] = useState<Array<{
    id: string;
    type: 'trigger' | 'automation' | 'macro' | 'setting';
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
    fixed: boolean;
  }>>([]);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
    
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际的API调用
      // const response = await fetch('/api/technical-review');
      // const data = await response.json();
      
      // 模拟数据
      const mockIssues = [
        {
          id: 'issue-1',
          type: 'trigger' as const,
          severity: 'high' as const,
          description: 'Duplicate trigger: "New ticket notification" sends emails multiple times under the same conditions',
          recommendation: 'Remove duplicate triggers or merge conditions',
          fixed: false,
        },
        {
          id: 'issue-2',
          type: 'automation' as const,
          severity: 'medium' as const,
          description: 'Automation rule "Close inactive tickets" is misconfigured, may close tickets too early',
          recommendation: 'Adjust inactivity threshold from 3 days to 7 days',
          fixed: false,
        },
        {
          id: 'issue-3',
          type: 'setting' as const,
          severity: 'low' as const,
          description: 'Ticket satisfaction survey not enabled, unable to collect customer feedback',
          recommendation: 'Enable satisfaction survey feature in settings',
          fixed: false,
        },
      ];
      
      setIssues(mockIssues);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleFix = (issueId: string) => {
    // 模拟API调用修复问题
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, fixed: true } : issue
    ));
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: 'trigger' | 'automation' | 'macro' | 'setting') => {
    switch (type) {
      case 'trigger':
        return 'Trigger';
      case 'automation':
        return 'Automation';
      case 'macro':
        return 'Macro';
      case 'setting':
        return 'Setting';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Technical Review</h2>
        <div className="flex items-center">
          {issueCount > 0 && !scanned && (
            <div className="flex items-center text-red-600 mr-4">
              <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
              <span>{issueCount} Issues</span>
            </div>
          )}
          <button
            onClick={handleScan}
            disabled={scanning}
            className="btn-primary flex items-center"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            {scanning ? 'Scanning...' : 'Quick Scan'}
          </button>
        </div>
      </div>

      {scanning && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2">Scanning your Sociamatic configuration...</span>
        </div>
      )}

      {scanned && issues.length === 0 && (
        <div className="flex items-center justify-center py-8 text-green-600">
          <CheckCircleIcon className="h-6 w-6 mr-2" />
          <span>Great! No configuration issues found</span>
        </div>
      )}

      {scanned && issues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Issues Found ({issues.length})</h3>
          <ul className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <li key={issue.id} className="py-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon 
                    className={`h-5 w-5 mr-2 ${getSeverityColor(issue.severity)}`} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity === 'high' ? 'High' : issue.severity === 'medium' ? 'Medium' : 'Low'}
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{getTypeLabel(issue.type)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{issue.description}</p>
                    <p className="mt-1 text-sm text-gray-600">Recommendation: {issue.recommendation}</p>
                  </div>
                  <div>
                    {issue.fixed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Fixed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFix(issue.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Quick Fix
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}