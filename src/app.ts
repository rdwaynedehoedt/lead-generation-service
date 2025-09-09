import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger, morganStream } from './utils/logger';
import contactOutService from './services/contactOutService';

// Import routes
import searchRoutes from './routes/search';
import contactsRoutes from './routes/contacts';
import companyRoutes from './routes/company';
import companyEmployeesRoutes from './routes/company-employees';
import debugCompanyRoutes from './routes/debug-company';
import advancedPeopleSearchRoutes from './routes/advanced-people-search';

// Import middleware
import { sanitizeRequest, validateRateLimit } from './middleware/validation';

// Validate required environment variables
if (!process.env.CONTACTOUT_API_KEY) {
  logger.error('❌ CONTACTOUT_API_KEY environment variable is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(require('morgan')('combined', { stream: morganStream }));

// Apply common middleware
app.use(sanitizeRequest);
app.use(validateRateLimit);

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/company-employees', companyEmployeesRoutes);
app.use('/api/debug-company', debugCompanyRoutes);
app.use('/api/advanced-people-search', advancedPeopleSearchRoutes);

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const healthCheck = await contactOutService.healthCheck();
    
    res.status(healthCheck.status === 'healthy' ? 200 : 503).json({
      status: healthCheck.status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'lead-generation-service',
      version: '1.0.0',
      contactout: healthCheck.details
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// ContactOut API test endpoint
app.get('/test-api', async (_req, res) => {
  try {
    logger.info('Testing ContactOut API connection');
    
    const testResult = await contactOutService.testApiConnection();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      apiTest: testResult
    });
  } catch (error) {
    logger.error('API test failed', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// ContactOut usage stats endpoint
app.get('/usage-stats', async (req, res) => {
  try {
    const { period } = req.query;
    
    logger.info('Fetching ContactOut usage stats', { period });
    
    const stats = await contactOutService.getUsageStats(period as string);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats
    });
  } catch (error) {
    logger.error('Failed to fetch usage stats', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Legacy endpoint redirect (for backward compatibility)
app.post('/search-prospects', (_req, res) => {
  res.status(301).json({
    success: false,
    error: 'Endpoint moved',
    message: 'This endpoint has been moved to /api/search/prospects',
    new_endpoint: '/api/search/prospects',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  try {
    await contactOutService.close();
    logger.info('ContactOut service closed');
  } catch (error) {
    logger.error('Error during shutdown', error);
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  try {
    await contactOutService.close();
    logger.info('ContactOut service closed');
  } catch (error) {
    logger.error('Error during shutdown', error);
  }
  
  process.exit(0);
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 Lead Generation Service running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    logger.info(`🧪 API test: http://localhost:${PORT}/test-api`);
    logger.info(`📊 Usage stats: http://localhost:${PORT}/usage-stats`);
    logger.info(`🔍 Search prospects: POST http://localhost:${PORT}/api/search/prospects`);
    logger.info(`💎 Reveal contacts: POST http://localhost:${PORT}/api/contacts/reveal`);
    logger.info(`✉️ Verify email: POST http://localhost:${PORT}/api/contacts/verify-email`);
    logger.info(`💰 Check credits: GET http://localhost:${PORT}/api/contacts/credits`);
  });
}

export default app;
