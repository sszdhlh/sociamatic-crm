import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ApiTestComponent from '../components/dashboard/ApiTestComponent';
import { useAuth } from '../contexts/AuthContext';

/**
 * 仪表盘页面
 */
const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while authentication state is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't show content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Sociamatic CRM</title>
        <meta name="description" content="Sociamatic CRM System Dashboard" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        
        {user && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">Welcome, {user.name}!</p>
          </div>
        )}
        
        <div className="mb-8">
          <ApiTestComponent />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add other dashboard components here */}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;