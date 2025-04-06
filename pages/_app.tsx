import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Layout from '@/components/layout/Layout';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}