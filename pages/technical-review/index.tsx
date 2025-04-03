import { useState } from 'react';
import Head from 'next/head';
import { WrenchScrewdriverIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type ConfigIssue = {
  id: string;
  type: 'trigger' | 'automation' | 'macro' | 'setting';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  fixed: boolean;
};

export default function TechnicalReview() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [issues, setIssues] = useState<ConfigIssue[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
    
    // Simulating API calls
    setTimeout(() => {
      // Here should be the actual API call
      // const response = await fetch('/api/technical-review');
      // const data = await response.json();
      
      // Simulating data
      const mockIssues: ConfigIssue[] = [
        {
          id: 'issue-1',
          type: 'trigger',
          severity: 'high',
          description: 'Repeated triggers："New Ticket Notification"Sending multiple emails under the same conditions',
          recommendation: 'Remove duplicate triggers or merge conditions',
          fixed: false,
        },
        {
          id: 'issue-2',
          type: 'automation',
          severity: 'medium',
          description: 'Automation rule "Close Inactive Tickets" is misconfigured, potentially closing tickets too early',
          recommendation: 'Adjust inactivity threshold from 3 days to 7 days',
          fixed: false,
        },
        {
          id: 'issue-3',
          type: 'setting',
          severity: 'low',
          description: 'Ticket satisfaction survey not enabled, unable to collect customer feedback',
          recommendation: 'Enable satisfaction survey feature in settings',
          fixed: false,
        },
        {
          id: 'issue-4',
          type: 'macro',
          severity: 'medium',
          description: 'Macro "Standard Reply" contains outdated contact information',
          recommendation: 'Update phone numbers and email addresses in the macro',
          fixed: false,
        },
        {
          id: 'issue-5',
          type: 'trigger',
          severity: 'high',
          description: 'Trigger "Urgent Ticket Escalation" has incorrect conditions, causing normal tickets to be escalated incorrectly',
          recommendation: 'Modify trigger conditions to ensure only truly urgent tickets are escalated',
          fixed: false,
        },
        {
          id: 'issue-6',
          type: 'setting',
          severity: 'high',
          description: 'Working hours not set, causing inaccurate SLA calculations',
          recommendation: 'Configure correct working hours in settings',
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

  const handleFixAll = () => {
    // 模拟API调用修复所有问题
    setIssues(issues.map(issue => ({ ...issue, fixed: true })));
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSeverityChange = (severity: string) => {
    setSelectedSeverities(prev =>
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const filteredIssues = issues.filter(issue => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(issue.type);
    const severityMatch = selectedSeverities.length === 0 || selectedSeverities.includes(issue.severity);
    return typeMatch && severityMatch;
  });

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
        return 'Settings';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="py-6">
      <Head>
        <title>Technical Review | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="Scan and fix Sociamatic configuration issues" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Technical Review</h1>
          <div className="flex space-x-4">
            {scanned && issues.length > 0 && (
              <button
                onClick={handleFixAll}
                className="btn-secondary flex items-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Fix All Issues
              </button>
            )}
            <button
              onClick={handleScan}
              disabled={scanning}
              className="btn-primary flex items-center"
            >
              {scanning ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                  Start Scan
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Configuration Check</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Scan your Sociamatic instance to detect potential configuration issues and get fix recommendations
            </p>
          </div>

          {scanning && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-lg">Scanning your Sociamatic configuration...</span>
            </div>
          )}

          {scanned && issues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-green-600">
              <CheckCircleIcon className="h-16 w-16 mb-4" />
              <span className="text-lg font-medium">Great! No configuration issues found</span>
              <p className="mt-2 text-sm text-gray-500">Your Sociamatic configuration looks very healthy</p>
            </div>
          )}

          {scanned && issues.length > 0 && (
            <div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Filter by Type</label>
                      <div className="flex space-x-2">
                        {['trigger', 'automation', 'macro', 'setting'].map((type) => (
                          <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`px-2 py-1 text-xs rounded ${selectedTypes.includes(type) ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {getTypeLabel(type as any)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Filter by Severity</label>
                      <div className="flex space-x-2">
                        {['high', 'medium', 'low'].map((severity) => (
                          <button
                            key={severity}
                            onClick={() => handleSeverityChange(severity)}
                            className={`px-2 py-1 text-xs rounded ${selectedSeverities.includes(severity) ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                    Found {issues.length} issues, {issues.filter(i => i.fixed).length} fixed
                  </div>
                </div>
              </div>

              <ul className="divide-y divide-gray-200">
                {filteredIssues.length === 0 ? (
                  <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                    No issues match the filter criteria
                  </li>
                ) : (
                  filteredIssues.map((issue) => (
                    <li key={issue.id} className="px-4 py-5 sm:px-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon 
                            className={`h-6 w-6 ${getSeverityColor(issue.severity)}`} 
                            aria-hidden="true" 
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getSeverityColor(issue.severity)}`}>
                              {issue.severity === 'high' ? 'High Severity' : issue.severity === 'medium' ? 'Medium Severity' : 'Low Severity'}
                            </span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm text-gray-600">{getTypeLabel(issue.type)}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-900 font-medium">{issue.description}</p>
                          <p className="mt-1 text-sm text-gray-600">Recommendation: {issue.recommendation}</p>
                        </div>
                        <div className="ml-4">
                          {issue.fixed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Fixed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleFix(issue.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Quick Fix
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}