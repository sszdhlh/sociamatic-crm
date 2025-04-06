import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/common/FileUpload';
import ticketService from '@/services/api/ticketService';

export default function CreateTicket() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    requester: '',
    tags: ''
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError('');
    
    try {
      // 准备提交的数据
      const ticketData = {
        title: formData.subject,
        description: formData.description,
        priority: formData.priority as 'high' | 'medium' | 'low',
        customerId: formData.requester || 'default-customer-id', // 假设有默认客户ID
        // 如果有标签，将其转换为数组
        customFields: formData.tags ? { tags: formData.tags.split(',').map(tag => tag.trim()) } : undefined
      };
      
      console.log('Creating ticket with data:', ticketData);
      console.log('Files to upload:', files);
      
      // 如果有文件，使用带文件上传的方法
      if (files.length > 0) {
        await ticketService.createTicketWithFiles(ticketData, files);
      } else {
        await ticketService.createTicket(ticketData);
      }
      
      // 成功后重定向到工单列表
      router.push('/tickets');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setUploadError('Failed to create ticket, please try again');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <Head>
        <title>Create Ticket | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="Create a new support ticket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Ticket</h1>
          <button
            onClick={() => router.back()}
            className="btn-outline flex items-center"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Cancel
          </button>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  className="mt-1 input"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={5}
                  required
                  className="mt-1 input"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    id="priority"
                    className="mt-1 input"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="requester" className="block text-sm font-medium text-gray-700">
                    Requester Email
                  </label>
                  <input
                    type="email"
                    name="requester"
                    id="requester"
                    className="mt-1 input"
                    value={formData.requester}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="mt-1 input"
                  placeholder="e.g. login, access, admin"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <FileUpload 
                onFilesChange={handleFilesChange}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
              />
              <p className="text-xs text-gray-500 mt-1">Supports images, PDF, Office documents and other common file formats</p>
            </div>

            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {uploadError}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                    Create Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}