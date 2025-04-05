import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - 页面未找到 | Sociamatic CRM</title>
        <meta name="description" content="404 - 页面未找到" />
      </Head>
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-6xl font-bold text-gray-400">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            页面未找到
          </h2>
          <p className="mt-2 text-gray-600">
            抱歉，您访问的页面不存在。
          </p>
          <div className="mt-8">
            <Link href="/" className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 