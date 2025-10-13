# Fullstack Lambda React Application

A serverless fullstack application that combines Express.js backend and React frontend in a single AWS Lambda function, specifically designed for Kibo Commerce subnavigation link integration with secure webhook handling and server-side data injection.

## 🚀 Core Concept

This application demonstrates a unique approach to fullstack development by:
- **Single Lambda Deployment**: Both backend API and frontend React app run within one AWS Lambda function
- **SSR Simulation**: Server-side data injection into React components without traditional SSR complexity
- **Secure Webhook Integration**: HMAC-SHA256 signature verification for Kibo Commerce webhook security
- **No Hassle UI Components**: Pre-built React components that receive data through global window injection

## 📋 Technology Stack

### Backend
- **Express.js** `^4.18.2` - Web framework for API routes and static file serving
- **Node.js** `20.x` - Runtime environment (AWS Lambda)
- **TypeScript** `^5.9.3` - Type safety and development experience
- **Serverless Framework** `v3` - Infrastructure as Code deployment
- **Kibo Commerce REST SDK** `^2.2530.1` - Integration with Kibo Commerce APIs

### Frontend
- **React** `^18.0.0` - UI library
- **React DOM** `^18.0.0` - DOM rendering
- **Vite** `^7.1.9` - Build tool and development server
- **TailwindCSS** `^4.1.14` - Utility-first CSS framework
- **TypeScript** `^5.0.0` - Type safety for React components

### DevOps & Tooling
- **Serverless ESBuild** `^1.55.1` - Fast TypeScript compilation and bundling
- **Serverless Offline** `^14.4.0` - Local development environment
- **Serverless HTTP** `^4.0.0` - Express.js adapter for AWS Lambda

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│             AWS Lambda Function             │
├─────────────────────────────────────────────┤
│  Express.js Server                          │
│  ├─ API Routes (/api/*)                     │
│  ├─ Static Assets (/assets/*)               │
│  └─ SSR-like Data Injection (POST *)        │
├─────────────────────────────────────────────┤
│  React Frontend (Built & Bundled)           │
│  ├─ Vite Build Output                       │
│  ├─ TailwindCSS Styling                     │
│  └─ Global Data Access (window.__ORDER_DATA__) │
└─────────────────────────────────────────────┘
```

## 🔄 SSR Simulation: How Data Flows to React Components

This application uses a novel approach to pass server-side data to React components without traditional SSR:

### 1. Webhook Reception & Verification
```typescript
// src/app.ts:30
const isValidHash = verifyHash(messageHash as string, dt as string, rawContent)
```
- Receives POST webhooks from Kibo Commerce
- Verifies HMAC-SHA256 signatures using shared secret
- Ensures secure communication between Kibo and Lambda

### 2. Dynamic Data Fetching
```typescript
// src/app.ts:41-44
const orderApi = new OrderApi(Configuration.fromEnv())
const orderId = parseOrderId(body['x-vol-return-url'])
const orderData = await orderApi.getOrder({orderId})
```
- Extracts order ID from webhook payload
- Fetches complete order data from Kibo Commerce API
- Processes data server-side before rendering

### 3. Server-Side HTML Injection
```typescript
// src/app.ts:46-47
const injectedScript = `<script>window.__ORDER_DATA__ = ${JSON.stringify(orderData)};</script>`;
html = html.replace('</head>', `${injectedScript}</head>`);
```
- Injects order data into HTML as global JavaScript variable
- Modifies the built React `index.html` before serving
- Creates bridge between server data and client components

### 4. Client-Side Data Consumption
```typescript
// frontend/src/main.tsx:6
const orderData = (window as any).__ORDER_DATA__;

// frontend/src/main.tsx:10
<App order={orderData}/>
```
- React components access pre-loaded data from `window.__ORDER_DATA__`
- No additional API calls needed on client-side
- Immediate data availability on component mount

## 🎯 Benefits of This Approach

### Single Lambda Efficiency
- **Cost Effective**: One Lambda function handles both frontend and backend
- **Simple Deployment**: Single `serverless deploy` command
- **Unified Logging**: All application logs in one CloudWatch stream
- **Reduced Cold Starts**: Frontend and backend share the same execution context

### SSR-like Performance Without Complexity
- **Fast Initial Load**: Data pre-loaded before React hydration
- **No Loading States**: Components receive data immediately
- **SEO Friendly**: Content available in initial HTML response
- **Simple Architecture**: No complex SSR setup or Next.js configuration

### Security & Integration
- **Webhook Verification**: HMAC-SHA256 signature validation in `src/utils/verifyHash.ts:8`
- **Environment Variables**: Secure credential management through AWS Lambda environment
- **Kibo Commerce Integration**: Native SDK usage for API communication

## 🛠️ Development Setup

### Prerequisites
- **Node.js 20.19+** (required for Vite build process)
- AWS CLI configured
- Serverless Framework installed globally

> **Note**: The Vite build process specifically requires Node.js 20.19 or higher. Earlier versions may cause build failures in the frontend compilation step.

### Local Development
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Configure environment variables
cp .env.example .env
# Edit .env with your Kibo Commerce credentials

# Build and run locally
npm run offline
```

### Deployment
```bash
# Build and deploy to AWS
npm run deploy
```

## 📁 Project Structure

```
├── src/
│   ├── app.ts              # Express.js application logic
│   ├── index.ts            # Lambda handler entry point
│   └── utils/
│       ├── verifyHash.ts   # HMAC-SHA256 webhook verification
│       └── parseOrderId.ts # Order ID extraction utility
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React DOM rendering + data injection
│   │   └── index.css       # TailwindCSS styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configuration
├── serverless.yml          # AWS Lambda deployment configuration
└── package.json            # Backend dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
Required environment variables for Kibo Commerce integration:
- `KIBO_TENANT` - Your Kibo tenant ID
- `KIBO_SITE` - Your Kibo site ID
- `KIBO_AUTH_HOST` - Kibo authentication host
- `KIBO_CLIENT_ID` - Application client ID
- `KIBO_SHARED_SECRET` - Webhook signature verification secret
- `KIBO_API_ENV` - API environment (sandbox/production)

### Serverless Configuration
The `serverless.yml` configures:
- **Runtime**: Node.js 20.x on AWS Lambda
- **HTTP API**: Fast, cost-effective API Gateway alternative
- **ESBuild**: Fast TypeScript compilation and tree-shaking
- **Environment**: Automatic injection of Kibo Commerce credentials

## 🚀 Key Features

### Webhook Security
- HMAC-SHA256 signature verification ensures webhook authenticity
- Double-hash verification process following Kibo Commerce standards
- Request timestamp validation for replay attack prevention

### Order Data Display
- Real-time order information fetching from Kibo Commerce
- Responsive TailwindCSS-styled order details interface
- Customer information and line item display

### Development Experience
- TypeScript throughout for type safety
- Hot reload with Vite for frontend development
- Serverless offline for local Lambda simulation
- ESBuild for fast compilation and deployment

This architecture provides a robust, secure, and efficient way to build fullstack applications that integrate seamlessly with Kibo Commerce while maintaining the simplicity of a single Lambda deployment.