# Sociamatic CRM API Documentation

## Base Information

- Base URL: `/api/v1`
- Authentication: Bearer Token
- Response Format: JSON

## Authentication APIs

### User Authentication

#### Login
- **POST** `/auth/login`
```json
{
  "email": "string",
  "password": "string"
}
```

#### Register
- **POST** `/auth/register`
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "string"
}
```

#### Refresh Token
- **POST** `/auth/refresh-token`

## Ticket Management APIs

### Ticket Operations

#### Create Ticket
- **POST** `/tickets`
```json
{
  "title": "string",
  "description": "string",
  "priority": "high|medium|low",
  "customerId": "string",
  "assigneeId": "string",
  "attachments": ["string"],
  "templateId": "string",
  "customFields": "object"
}
```

#### Get Ticket List
- **GET** `/tickets`
- Query Parameters:
  - status: Filter by status
  - priority: Filter by priority
  - page: Page number
  - limit: Items per page
  - assigneeId: Filter by assignee
  - customerId: Filter by customer
  - dateRange: Filter by date range

#### Get Ticket Details
- **GET** `/tickets/{id}`

#### Update Ticket
- **PUT** `/tickets/{id}`
```json
{
  "status": "string",
  "priority": "string",
  "assigneeId": "string",
  "customFields": "object"
}
```

#### Delete Ticket
- **DELETE** `/tickets/{id}`

### Ticket Comments

#### Add Comment
- **POST** `/tickets/{id}/comments`
```json
{
  "content": "string",
  "isPrivate": "boolean",
  "attachments": ["string"]
}
```

## Knowledge Base APIs

### Article Management

#### Create Article
- **POST** `/knowledge-base/articles`
```json
{
  "title": "string",
  "content": "string",
  "categoryId": "string",
  "tags": ["string"],
  "status": "draft|published",
  "visibility": "public|private"
}
```

#### Get Articles
- **GET** `/knowledge-base/articles`
- Query Parameters:
  - category: Filter by category
  - status: Filter by status
  - search: Search term

#### Update Article
- **PUT** `/knowledge-base/articles/{id}`

### Category Management

#### Create Category
- **POST** `/knowledge-base/categories`
```json
{
  "name": "string",
  "description": "string",
  "parentId": "string"
}
```

## Customer Management APIs

### Customer Operations

#### Create Customer
- **POST** `/customers`
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "organizationId": "string",
  "tags": ["string"],
  "customFields": "object"
}
```

#### Get Customer List
- **GET** `/customers`
- Query Parameters:
  - search: Search term
  - organizationId: Filter by organization
  - tags: Filter by tags

#### Get Customer Details
- **GET** `/customers/{id}`

#### Update Customer
- **PUT** `/customers/{id}`

#### Delete Customer
- **DELETE** `/customers/{id}`

## Organization Management APIs

### Organization Operations

#### Create Organization
- **POST** `/organizations`
```json
{
  "name": "string",
  "industry": "string",
  "size": "string",
  "address": "string",
  "customFields": "object"
}
```

#### Get Organization List
- **GET** `/organizations`

#### Get Organization Details
- **GET** `/organizations/{id}`

#### Update Organization
- **PUT** `/organizations/{id}`

#### Delete Organization
- **DELETE** `/organizations/{id}`

## SLA Management APIs

### SLA Policies

#### Create SLA Policy
- **POST** `/sla-policies`
```json
{
  "name": "string",
  "description": "string",
  "responseTime": "number",
  "resolutionTime": "number",
  "priority": "string",
  "businessHours": "boolean"
}
```

#### Get SLA Policy List
- **GET** `/sla-policies`

#### Update SLA Policy
- **PUT** `/sla-policies/{id}`

## Automation Rules APIs

### Triggers

#### Create Trigger
- **POST** `/triggers`
```json
{
  "name": "string",
  "conditions": [{
    "field": "string",
    "operator": "string",
    "value": "any"
  }],
  "actions": [{
    "type": "string",
    "params": "object"
  }],
  "isActive": "boolean"
}
```

#### Get Trigger List
- **GET** `/triggers`

#### Update Trigger
- **PUT** `/triggers/{id}`

## Analytics APIs

### Reports

#### Get Ticket Statistics
- **GET** `/analytics/tickets`
- Query Parameters:
  - startDate: Start date
  - endDate: End date
  - groupBy: Grouping method
  - metrics: Required metrics

#### Get Response Time Analysis
- **GET** `/analytics/response-time`

#### Get SLA Performance
- **GET** `/analytics/sla-performance`

#### Get Agent Performance
- **GET** `/analytics/agent-performance`

## User Preferences APIs

### Personal Settings

#### Get User Settings
- **GET** `/preferences`

#### Update User Settings
- **PUT** `/preferences`
```json
{
  "notifications": {
    "email": "boolean",
    "inApp": "boolean",
    "desktop": "boolean"
  },
  "theme": "light|dark|system",
  "language": "string",
  "timezone": "string"
}
```

## Integration APIs

### Email Integration

#### Configure Email Settings
- **POST** `/integrations/email/config`
```json
{
  "inboundSettings": {
    "protocol": "string",
    "host": "string",
    "port": "number",
    "credentials": "object"
  },
  "outboundSettings": {
    "protocol": "string",
    "host": "string",
    "port": "number",
    "credentials": "object"
  }
}
```

### Chat Integration

#### Configure Chat Widget
- **POST** `/integrations/chat/config`
```json
{
  "widgetSettings": {
    "title": "string",
    "theme": "object",
    "position": "string"
  },
  "routingRules": "object"
}
```

## Data Structures

### Ticket
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "customerId": "string",
  "assigneeId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "dueDate": "datetime",
  "tags": ["string"],
  "attachments": ["string"],
  "customFields": "object"
}
```

### Customer
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "organizationId": "string",
  "tags": ["string"],
  "customFields": "object",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Organization
```json
{
  "id": "string",
  "name": "string",
  "industry": "string",
  "size": "string",
  "address": "string",
  "customFields": "object",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### SLA Policy
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "responseTime": "number",
  "resolutionTime": "number",
  "priority": "string",
  "businessHours": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Trigger
```json
{
  "id": "string",
  "name": "string",
  "conditions": [{
    "field": "string",
    "operator": "string",
    "value": "any"
  }],
  "actions": [{
    "type": "string",
    "params": "object"
  }],
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```