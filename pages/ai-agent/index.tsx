import { useState, useRef } from 'react';
import Head from 'next/head';
import { PaperAirplaneIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 模拟的工单建议数据
  const ticketSuggestions = [
    {
      id: 'sugg-1',
      subject: 'Unable to login to admin console',
      analysis: 'This is an account access issue, likely related to user permissions or credentials.',
      priority: 'high',
      assignTo: 'Technical Support Team',
      estimatedTime: '30 minutes',
    },
    {
      id: 'sugg-2',
      subject: 'How to set up auto-reply rules?',
      analysis: 'This is a feature inquiry, user needs guidance on configuring auto-reply functionality.',
      priority: 'normal',
      assignTo: 'Customer Success Team',
      estimatedTime: '15 minutes',
    },
    {
      id: 'sugg-3',
      subject: 'Integrate third-party payment system',
      analysis: 'This is a technical integration issue, requiring API and development expertise.',
      priority: 'urgent',
      assignTo: 'Development Team',
      estimatedTime: '2 hours',
    },
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulating AI responses
    setTimeout(() => {
      let response = '';
      
      // Simple keyword matching to simulate AI response
      if (input.toLowerCase().includes('ticket')) {
        response = 'Tickets are a core feature of Sociamatic. You can view and manage all tickets in the ticket management page. Each ticket has attributes like ID, subject, status, and priority. You can categorize, assign, and respond to tickets as needed.';
      } else if (input.toLowerCase().includes('trigger')) {
        response = 'Triggers are one of Sociamatic\'s automation features that automatically perform predefined actions when specific conditions are met. For example, automatically assigning new tickets to specific teams or sending notification emails when ticket status changes.';
      } else if (input.toLowerCase().includes('automation')) {
        response = 'Sociamatic offers various automation features including triggers, automation rules, and macros. These features help reduce repetitive work and improve customer support efficiency. You can check your current automation configuration for issues in the Technical Review page.';
      } else {
        response = 'Thank you for your question. I am the Sociamatic Smart Assistant and can help you with questions about Sociamatic configuration, ticket management, and automation rules. If you have specific questions about using Sociamatic, please provide details and I will do my best to help.';
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage, assistantMessage]);
      setIsProcessing(false);
      scrollToBottom();
    }, 1500);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="py-6">
      <Head>
        <title>AI Assistant | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="AI-powered Sociamatic Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">AI Assistant</h1>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === 'chat' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('chat')}
            >
              Smart Conversation
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === 'suggestions' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('suggestions')}
            >
              Ticket Suggestions
            </button>
          </div>
        </div>

        {activeTab === 'chat' && (
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <SparklesIcon className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Sociamatic Smart Assistant</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                I can help you with questions about Sociamatic, provide configuration suggestions, or analyze ticket data
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <SparklesIcon className="h-12 w-12 mb-4" />
                  <p className="text-center">Ask the AI Assistant for Sociamatic-related help</p>
                  <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-md">
                    {[
                      'How to optimize my trigger configuration?',
                      'How should I set ticket priorities?',
                      'What are the recommended automation workflows?'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                        onClick={() => {
                          setInput(suggestion);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-900'}`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="mt-1 text-xs text-gray-500 text-right">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-3/4 rounded-lg px-4 py-2 bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your question..."
                  className="input flex-1"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  className="btn-primary p-2"
                  disabled={!input.trim() || isProcessing}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">AI Ticket Analysis & Suggestions</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Provides intelligent processing suggestions for tickets based on historical data and pattern analysis
                  </p>
                </div>
                <button className="btn-outline flex items-center">
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Refresh Analysis
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {ticketSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-md font-medium text-gray-900">{suggestion.subject}</h3>
                      <p className="mt-1 text-sm text-gray-600">{suggestion.analysis}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)} bg-opacity-10`}>
                          Priority: {suggestion.priority === 'urgent' ? 'Urgent' : suggestion.priority === 'high' ? 'High' : suggestion.priority === 'normal' ? 'Normal' : 'Low'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Suggested Assignee: {suggestion.assignTo}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Estimated Time: {suggestion.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button className="btn-primary text-sm py-1 px-3">
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}