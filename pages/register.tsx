import Head from 'next/head';
import RegisterForm from '../components/RegisterForm';

/**
 * Register page
 */
const RegisterPage = () => {
  return (
    <>
      <Head>
        <title>Register | Sociamatic CRM</title>
        <meta name="description" content="Register a Sociamatic CRM account" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
        <div className="text-center mb-10 max-w-md px-4">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Sociamatic CRM</h1>
          <p className="text-gray-600 mt-3 text-lg">Customer Relationship Management System</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Need help? Contact <a href="mailto:support@sociamatic.com" className="text-blue-500 hover:underline">support@sociamatic.com</a></p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage; 