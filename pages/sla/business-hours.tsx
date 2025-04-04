import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { ArrowLeftIcon, ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type BusinessHours = {
  id: string;
  name: string;
  days: WeekDay[];
  startTime: string;
  endTime: string;
  timezone: string;
  description?: string;
};

export default function BusinessHoursManagement() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<BusinessHours>({
    id: isEditing ? String(id) : '',
    name: '',
    days: [],
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC+0 (GMT)',
    description: '',
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    days?: string;
  }>({});

  // Mock data for demonstration purposes
  const mockBusinessHours: BusinessHours[] = [
    {
      id: '1',
      name: 'Standard Business Hours',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC-5 (Eastern Time)',
      description: 'Regular working hours for North American operations',
    },
    {
      id: '2',
      name: '24/7 Support',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startTime: '00:00',
      endTime: '23:59',
      timezone: 'UTC+0 (GMT)',
      description: 'Round-the-clock support for critical systems',
    },
    {
      id: '3',
      name: 'Extended Hours',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '20:00',
      timezone: 'UTC-8 (Pacific Time)',
      description: 'Extended support hours for West Coast operations',
    },
  ];

  // Load business hours data if editing
  useEffect(() => {
    if (isEditing) {
      const businessHours = mockBusinessHours.find(bh => bh.id === id);
      if (businessHours) {
        setFormData(businessHours);
      } else {
        router.push('/sla');
      }
    }
  });

  const timezoneOptions = [
    'UTC-12 (Baker Island)',
    'UTC-11 (American Samoa)',
    'UTC-10 (Hawaii)',
    'UTC-9 (Alaska)',
    'UTC-8 (Pacific Time)',
    'UTC-7 (Mountain Time)',
    'UTC-6 (Central Time)',
    'UTC-5 (Eastern Time)',
    'UTC-4 (Atlantic Time)',
    'UTC-3 (Buenos Aires)',
    'UTC-2 (Mid-Atlantic)',
    'UTC-1 (Azores)',
    'UTC+0 (GMT)',
    'UTC+1 (Central European Time)',
    'UTC+2 (Eastern European Time)',
    'UTC+3 (Moscow)',
    'UTC+4 (Dubai)',
    'UTC+5 (Pakistan)',
    'UTC+5:30 (India)',
    'UTC+6 (Bangladesh)',
    'UTC+7 (Thailand)',
    'UTC+8 (China, Singapore)',
    'UTC+9 (Japan)',
    'UTC+10 (Sydney)',
    'UTC+11 (Solomon Islands)',
    'UTC+12 (New Zealand)',
  ];

  const weekdays: WeekDay[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

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

  const handleDayToggle = (day: WeekDay) => {
    setFormData(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      
      return {
        ...prev,
        days: newDays
      };
    });
    
    // Clear days error if it exists
    if (errors.days) {
      setErrors(prev => ({ ...prev, days: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Calendar name is required';
    }
    
    if (formData.days.length === 0) {
      newErrors.days = 'At least one day must be selected';
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
    console.log('Submitting business hours:', formData);
    
    // Redirect back to SLA list
    router.push('/sla');
  };

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit' : 'Create'} Business Hours | Sociamatic CRM</title>
        <meta name="description" content={`${isEditing ? 'Edit' : 'Create'} business hours calendar for SLA policies`} />
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
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditing ? 'Edit' : 'Create'} Business Hours Calendar
            </h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Calendar Details</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Define when your support team is available to respond to tickets.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Calendar Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                        placeholder="e.g., Standard Business Hours"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Brief description of this calendar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Working Days</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the days of the week when your team is available.
                  </p>
                  {errors.days && (
                    <p className="mt-1 text-sm text-red-600">{errors.days}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {weekdays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${formData.days.includes(day) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Working Hours</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Define the hours during which your team is available on the selected days.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <div className="mt-1">
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        {timezoneOptions.map((timezone) => (
                          <option key={timezone} value={timezone}>{timezone}</option>
                        ))}
                      </select>
                    </div>
                  </div>
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
                    {isEditing ? 'Update' : 'Create'} Calendar
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