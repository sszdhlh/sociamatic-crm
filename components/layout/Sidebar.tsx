import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  XMarkIcon,
  HomeIcon,
  TicketIcon,
  WrenchScrewdriverIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  EyeIcon,
  BoltIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmDialog from './ConfirmDialog';

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Ticket Management', href: '/tickets', icon: TicketIcon },
  { name: 'Technical Review', href: '/technical-review', icon: WrenchScrewdriverIcon },
  { name: 'Automation', href: '/automation', icon: CogIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'AI Assistant', href: '/ai-agent', icon: SparklesIcon },
  { name: 'User Management', href: '/user-management', icon: UserGroupIcon },
  { name: 'Customers', href: '/customers', icon: UserIcon },
  { name: 'Organizations', href: '/organizations', icon: BuildingOfficeIcon },
  { name: 'Macros', href: '/macros', icon: DocumentTextIcon },
  { name: 'Views', href: '/views', icon: EyeIcon },
  { name: 'Triggers', href: '/triggers', icon: BoltIcon },
  { name: 'SLA Management', href: '/sla', icon: ClockIcon },
];


export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'SM';
  const userName = user?.name || 'Sociamatic Admin';
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  
  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-xl font-bold text-primary-600">Sociamatic Portal</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 ${
                            isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 group block w-full">
                  <div className="flex items-center mb-2">
                    <div>
                      <div className="inline-block h-9 w-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                        <span className="text-sm font-medium">{userInitials}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{userName}</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <Link 
                      href="/settings" 
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700"
                    >
                      <CogIcon className="h-5 w-5 mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-primary-600">Sociamatic Portal</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center mb-2">
                  <div>
                    <div className="inline-block h-9 w-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                      <span className="text-sm font-medium">{userInitials}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{userName}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link 
                    href="/settings" 
                    className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700"
                  >
                    <CogIcon className="h-4 w-4 mr-1.5" />
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogoutClick}
                    className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out" 
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
}