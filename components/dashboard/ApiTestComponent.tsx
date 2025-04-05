import { useState, useEffect } from 'react';
import { ticketService } from '../../services/api';
import { Ticket } from '../../services/api/ticketService';

/**
 * API测试组件，用于测试与后端API的集成
 */
const ApiTestComponent = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取工单列表
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketService.getTickets({ 
          page: 1, 
          limit: 10 
        });
        setTickets(response.tickets);
        setError(null);
      } catch (err) {
        console.error('获取工单失败:', err);
        setError('获取工单数据失败，请确保API服务运行正常');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">API集成测试</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">加载中...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">请检查：</p>
          <ul className="list-disc ml-5 text-sm">
            <li>后端API服务是否运行 (默认 http://localhost:3007)</li>
            <li>环境变量是否正确配置 (.env.local)</li>
            <li>网络连接是否正常</li>
            <li>CORS设置是否允许前端访问</li>
          </ul>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>暂无工单数据。API连接成功，但没有检索到记录。</p>
        </div>
      ) : (
        <div>
          <p className="text-green-600 mb-4">✓ API连接成功！检索到 {tickets.length} 条工单记录。</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 