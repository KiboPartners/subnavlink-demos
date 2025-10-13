# Claude Context: Fullstack Lambda React Application

## Project Overview
This is a serverless fullstack application that demonstrates a unique architectural pattern: combining Express.js backend and React frontend in a single AWS Lambda function. The application is specifically designed for Kibo Commerce subnavigation link integration with secure webhook handling.

## Key Architectural Patterns

### 1. Single Lambda Fullstack Pattern
- **Backend**: Express.js server (`src/app.ts`) handles API routes, static assets, and webhook processing
- **Frontend**: React application built with Vite and served as static files from Lambda
- **Deployment**: Single `serverless deploy` command deploys both frontend and backend
- **Benefits**: Cost efficiency, simplified deployment, unified logging

### 2. SSR Simulation via Data Injection
This project uses a novel approach to pass server-side data to React components without traditional SSR:

```typescript
// Server-side data injection (src/app.ts:46-47)
const injectedScript = `<script>window.__ORDER_DATA__ = ${JSON.stringify(orderData)};</script>`;
html = html.replace('</head>', `${injectedScript}</head>`);

// Client-side consumption (frontend/src/main.tsx:6)
const orderData = (window as any).__ORDER_DATA__;
```

**Key Benefits:**
- No loading states needed in React components
- Data available immediately on component mount
- SEO-friendly content in initial HTML response
- Simpler than full SSR setup

### 3. Kibo Commerce Integration
- **Webhook Security**: HMAC-SHA256 signature verification (`src/utils/verifyHash.ts`)
- **API Integration**: Uses `@kibocommerce/rest-sdk` for fetching order data
- **Environment Variables**: Secure credential management through AWS Lambda

## File Structure & Responsibilities

```
src/
├── app.ts              # Main Express application logic
│   ├── Static file serving (/assets/*)
│   ├── API routes (/api/*)
│   └── Webhook handling (POST *)
├── index.ts            # Lambda handler entry point
└── utils/
    ├── verifyHash.ts   # HMAC-SHA256 webhook verification
    └── parseOrderId.ts # Extract order ID from webhook payload

frontend/
├── src/
│   ├── App.tsx         # Main React component (receives order data as prop)
│   ├── main.tsx        # React DOM rendering + global data access
│   └── index.css       # TailwindCSS styles
└── vite.config.js      # Vite build configuration

serverless.yml          # AWS Lambda deployment configuration
```

## Development Patterns

### Webhook Flow
1. **Receive POST webhook** from Kibo Commerce
2. **Verify HMAC signature** using shared secret
3. **Parse order ID** from webhook payload
4. **Fetch order data** from Kibo Commerce API
5. **Inject data into HTML** as global variable
6. **Serve modified HTML** to client

### Build Process
1. **Frontend build**: `npm run build:frontend` (Vite builds React app)
2. **Backend compilation**: Serverless Framework + ESBuild handles TypeScript
3. **Asset bundling**: Frontend assets copied to `src/frontend-dist/`
4. **Lambda packaging**: All code bundled for AWS Lambda deployment

### Local Development
- **Frontend**: Vite dev server for hot reload
- **Backend**: Serverless offline for Lambda simulation
- **Integration**: Use `npm run offline` for full local testing

## Technology Choices & Versions

### Backend Stack
- **Express.js ^4.18.2**: Web framework for Lambda
- **TypeScript ^5.9.3**: Type safety throughout
- **Serverless Framework v3**: Infrastructure as Code
- **Node.js 20.x**: AWS Lambda runtime

### Frontend Stack
- **React ^18.0.0**: UI library
- **Vite ^7.1.9**: Fast build tool and dev server
- **TailwindCSS ^4.1.14**: Utility-first styling
- **TypeScript ^5.0.0**: Type safety for components

### DevOps Tools
- **Serverless ESBuild ^1.55.1**: Fast TypeScript compilation
- **Serverless Offline ^14.4.0**: Local Lambda simulation
- **Serverless HTTP ^4.0.0**: Express.js adapter for Lambda

## Security Considerations

### Webhook Verification
```typescript
// Double-hash verification following Kibo Commerce standards
const concatenated1 = APP_SECRET + APP_SECRET
const hash1 = crypto.createHash("sha256").update(concatenated1)
const concatenated2 = hash1.digest("base64") + receivedDateTime + rawContent
const hash2 = crypto.createHash("sha256").update(concatenated2)
const generatedHash = hash2.digest('base64')
```

### Environment Variables
All sensitive credentials stored as Lambda environment variables:
- `KIBO_TENANT`, `KIBO_SITE`, `KIBO_CLIENT_ID`
- `KIBO_SHARED_SECRET` (for webhook verification)
- `KIBO_AUTH_HOST`, `KIBO_API_ENV`

## Common Development Tasks

### Adding New API Routes
```typescript
// Add to src/app.ts
app.get('/api/new-endpoint', (req, res) => {
  // Handler logic
});
```

### Modifying React Components
- Components receive data through props from injected global variables
- No need for client-side API calls for initial data
- Use standard React patterns for state management

### Deploying Changes
```bash
npm run build    # Builds frontend
npm run deploy   # Deploys to AWS Lambda
```

### Local Testing
```bash
npm run offline  # Starts local Lambda simulation
```

## Performance Optimizations

### Bundle Size
- **ESBuild**: Fast compilation and tree-shaking
- **Vite**: Optimized frontend bundling
- **Selective Packaging**: Only necessary files included in Lambda

### Cold Start Mitigation
- **Single Function**: Reduces cold start frequency
- **Minimal Dependencies**: Faster initialization
- **Pre-built Assets**: No runtime compilation

## Troubleshooting Common Issues

### Webhook Verification Failures
- Check `KIBO_SHARED_SECRET` environment variable
- Verify timestamp (`dt`) parameter format
- Ensure raw request body preservation

### Frontend Build Issues
- Verify `frontend/package.json` dependencies
- Check Vite configuration in `vite.config.js`
- Ensure TailwindCSS build process

### Lambda Deployment Problems
- Validate `serverless.yml` configuration
- Check AWS credentials and permissions
- Verify Node.js version compatibility

## Future Enhancement Opportunities

### Scalability
- Add caching layer for order data
- Implement request/response compression
- Consider Lambda@Edge for global distribution

### Monitoring
- Add structured logging
- Implement health checks
- Set up CloudWatch alarms

### Security
- Add rate limiting for webhooks
- Implement request timeout handling
- Add input validation middleware

This architecture pattern is ideal for:
- **Rapid prototyping** of fullstack applications
- **E-commerce integrations** requiring secure webhook handling
- **Cost-sensitive applications** where Lambda pricing is optimal
- **Simple deployment** requirements without complex infrastructure