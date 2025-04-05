# Sociamatic CRM API 文档

## API文档可视化

我们使用Swagger UI为Sociamatic CRM API提供了交互式文档。这使得前端开发人员可以更容易地理解和测试API。

### 访问API文档

启动应用后，您可以通过以下URL访问API文档：

```
http://localhost:3007/api-docs
```

> 注意：端口号可能会根据您的环境配置而有所不同。请查看控制台输出以获取正确的端口号。

### 文档功能

Swagger UI提供以下功能：

1. **API浏览**：查看所有可用的API端点，按功能分组
2. **请求/响应模型**：查看每个API的请求和响应数据结构
3. **交互式测试**：直接在浏览器中测试API调用
4. **认证支持**：使用JWT令牌进行认证测试

### 使用认证

许多API端点需要认证才能访问。要在Swagger UI中测试这些端点：

1. 首先调用`/auth/login`端点获取令牌
2. 点击Swagger UI界面顶部的"Authorize"按钮
3. 在弹出的对话框中，输入您的Bearer令牌（格式：`Bearer your_token_here`）
4. 点击"Authorize"按钮完成认证

现在，您可以测试需要认证的API端点了。

## API分组

API端点按以下功能分组：

- **Authentication**：用户认证和授权
- **Tickets**：工单管理
- **Customers**：客户管理
- **Organizations**：组织管理
- **Knowledge Base**：知识库管理
- **SLA Policies**：服务级别协议管理
- **Analytics**：数据分析和报告
- **Preferences**：用户偏好设置

## 开发者注意事项

如果您需要更新API文档，可以编辑以下文件：

- `src/routes/*.swagger.js`：包含API端点的Swagger注释
- `src/config/swagger.js`：Swagger配置文件

添加新的API端点时，请确保添加相应的Swagger注释，以保持文档的完整性和准确性。