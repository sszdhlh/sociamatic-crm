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
  
  // 检查用户是否已登录
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // 如果认证状态正在加载，显示加载
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果未认证，不显示内容
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>仪表盘 | Sociamatic CRM</title>
        <meta name="description" content="Sociamatic CRM系统仪表盘" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">仪表盘</h1>
        
        {user && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">欢迎, {user.name}!</p>
          </div>
        )}
        
        <div className="mb-8">
          <ApiTestComponent />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 此处可添加其他仪表盘组件 */}
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 