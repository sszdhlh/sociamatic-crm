import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { ArrowLeftIcon, DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';

type MacroCategory = 'greeting' | 'closing' | 'troubleshooting' | 'billing' | 'general';

export default function CreateMacro() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category: 'general' as MacroCategory,
    notes: '',
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    content?: string;
    category?: string;
  }>({});
  
  // Add approved field to match the structure in index.tsx
  useEffect(() => {
    // Initialize with default values or fetch from API if editing
    const initialData = {
      ...formData,
      approved: false,
      createdBy: 'Current User', // This would typically come from auth context
      createdAt: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      usageCount: 0
    };
    
    // If we're editing an existing macro, we would fetch it here
    // and update the form data
    
    // For now, just log the initial data structure
    console.log('Initial macro data:', initialData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Macro name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Macro name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Macro name must be less than 50 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Macro content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Macro content must be at least 10 characters';
    }
    
    // Validate that the category is one of the allowed values
    const validCategories: MacroCategory[] = ['greeting', 'closing', 'troubleshooting', 'billing', 'general'];
    if (!validCategories.includes(formData.category as MacroCategory)) {
      newErrors.category = 'Please select a valid category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would typically send the data to your API
    console.log('Submitting macro:', formData);
    
    // Redirect back to macros list
    router.push('/macros');
  };

  const getCategoryColor = (category: MacroCategory): string => {
    const colors: Record<MacroCategory, string> = {
      greeting: 'bg-green-100 text-green-800',
      closing: 'bg-purple-100 text-purple-800',
      troubleshooting: 'bg-blue-100 text-blue-800',
      billing: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };
  
  // Available variables for macros
  const availableVariables = [
    { name: '{{agent.name}}', description: 'Current agent name' },
    { name: '{{customer.name}}', description: 'Customer name' },
    { name: '{{customer.email}}', description: 'Customer email' },
    { name: '{{ticket.id}}', description: 'Ticket ID' },
    { name: '{{ticket.subject}}', description: 'Ticket subject' },
    { name: '{{ticket.product}}', description: 'Product name' },
    { name: '{{customer.account_status}}', description: 'Customer account status' },
    { name: '{{customer.next_payment_amount}}', description: 'Next payment amount' },
    { name: '{{customer.next_payment_date}}', description: 'Next payment date' },
  ];
  
  // Insert variable into content at cursor position
  const insertVariable = (variable: string) => {
    const contentField = document.getElementById('content') as HTMLTextAreaElement;
    if (!contentField) return;
    
    const start = contentField.selectionStart;
    const end = contentField.selectionEnd;
    const currentContent = formData.content;
    const newContent = currentContent.substring(0, start) + variable + currentContent.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
    
    // Focus back on textarea after inserting
    setTimeout(() => {
      contentField.focus();
      contentField.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  return (
    <>
      <Head>
        <title>Create Macro | Sociamatic CRM</title>
        <meta name="description" content="Create a new macro for ticket responses" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Macro</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Macro Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                    placeholder="e.g., Standard Greeting"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="greeting">Greeting</option>
                    <option value="closing">Closing</option>
                    <option value="troubleshooting">Troubleshooting</option>
                    <option value="billing">Billing</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(formData.category as MacroCategory)}`}>
                    <TagIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                    {formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Macro Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    value={formData.content}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.content ? 'border-red-300' : ''}`}
                    placeholder="Hello, thank you for contacting Sociamatic Support. My name is {{agent.name}} and I'll be assisting you today."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>
                
                {/* Variables dropdown */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insert Variable
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableVariables.map((variable, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertVariable(variable.name)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        title={variable.description}
                      >
                        {variable.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Preview section */}
                {formData.content && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preview (with sample data)
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
                      {formData.content
                        .replace(/{{agent\.name}}/g, 'John Doe')
                        .replace(/{{customer\.name}}/g, 'Jane Smith')
                        .replace(/{{ticket\.id}}/g, 'TKT-12345')
                        .replace(/{{ticket\.subject}}/g, 'Need help with login')
                        .replace(/{{ticket\.product}}/g, 'Sociamatic CRM')
                        .replace(/{{customer\.account_status}}/g, 'is active')
                        .replace(/{{customer\.next_payment_amount}}/g, '$99.00')
                        .replace(/{{customer\.next_payment_date}}/g, '2023-12-01')
                        .replace(/{{customer\.email}}/g, 'jane.smith@example.com')
                      }
                    </div>
                  </div>
                )}
                
                <p className="mt-2 text-sm text-gray-500">
                  You can use variables like {'{{agent.name}}'}, {'{{customer.name}}'}, {'{{ticket.id}}'} in your macro content.
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Internal notes about when to use this macro"
                  />
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Macro
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}