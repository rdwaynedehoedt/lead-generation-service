<<<<<<< HEAD
# Reachly Lead Generation Service

ContactOut API integration service for Reachly's lead generation capabilities.

## 🚀 Day 1 Implementation - COMPLETED

This is the foundation implementation for the ContactOut integration following our 8-week development plan.

### ✅ Completed Tasks (Day 1)

- [x] **API Setup & Testing**: ContactOut API integration configured via environment variables
- [x] **Development Environment**: Clean folder structure with TypeScript setup
- [x] **API Client Wrapper**: Complete ContactOut service with all endpoints
- [x] **Testing Framework**: Jest setup with comprehensive test suite
- [x] **Type Definitions**: Full TypeScript interfaces for ContactOut API
- [x] **Real API Testing**: Script to test live ContactOut API endpoints

## 📁 Project Structure

```
lead-generation-service/
├── src/
│   ├── services/
│   │   └── contactOutService.ts       # Main ContactOut API client
│   ├── types/
│   │   └── contactout.types.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── logger.ts                  # Winston logging setup
│   └── scripts/
│       └── test-contactout-api.ts     # Live API testing script
├── tests/
│   ├── setup.ts                       # Jest test configuration
│   └── services/
│       └── contactOutService.test.ts  # Service unit tests
├── logs/                              # Log files directory
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── jest.config.js                     # Jest testing configuration
└── env.example                        # Environment variables template
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd lead-generation-service
npm install
```

### 2. Environment Setup

Copy the environment example and configure:

```bash
cp env.example .env
```

Update `.env` with your configuration:
```bash
CONTACTOUT_API_KEY=your_contactout_api_key_here
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost:5432/reachly_dev
PORT=5001
NODE_ENV=development
```

### 3. Start Redis (Required for caching and rate limiting)

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
brew install redis  # macOS
redis-server
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Test Live ContactOut API

**⚠️ IMPORTANT**: This uses real API calls and may consume credits!

```bash
npm run test:api
```

This script tests all ContactOut endpoints:
- ✅ API Usage Stats
- ✅ People Search (with `reveal_info: false` to avoid credits)
- ✅ LinkedIn Profile Enrichment (with `profile_only: true`)
- ✅ Email Enrichment
- ✅ Company Information
- ✅ Contact Checker (Free)
- ✅ Email Verification

### Test Coverage

```bash
npm run test:coverage
```

## 📊 ContactOut API Capabilities

Based on our testing, here's what we've validated:

### Available Endpoints ✅

| Endpoint | Rate Limit | Credits | Status |
|----------|------------|---------|---------|
| `GET /v1/stats` | 1000/min | None | ✅ Working |
| `POST /v1/people/search` | 60/min | 1 search/result | ✅ Working |
| `GET /v1/linkedin/enrich` | 1000/min | 1 email + 1 phone | ✅ Working |
| `GET /v1/email/enrich` | 1000/min | 1 email + 1 phone | ✅ Working |
| `POST /v1/domain/enrich` | 1000/min | None (Free) | ✅ Working |
| `GET /v1/email/verify` | 1000/min | 1 verifier | ✅ Working |
| `GET /v1/people/linkedin/*_status` | 150/min | None (Free) | ✅ Working |

### Features Implemented ✅

- **Rate Limiting**: Redis-based rate limiting per organization
- **Caching**: Intelligent caching with appropriate TTLs
- **Error Handling**: Comprehensive error handling and retry logic
- **Type Safety**: Full TypeScript interfaces for all API responses
- **Logging**: Structured logging with Winston
- **Testing**: Unit tests and live API testing

## 🔧 Development Commands

```bash
# Development with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Test live API (uses real credits!)
npm run test:api

# Code quality
npm run lint
npm run lint:fix
npm run type-check
```

## 📈 Next Steps (Day 2-7)

Based on our Day 1 foundation, here's what's coming next:

### Day 2-3: Database Schema
- [ ] Create prospects table
- [ ] Create prospect_searches table  
- [ ] Create lead_scoring_models table
- [ ] Set up database migrations

### Day 4-5: API Controllers
- [ ] Search controller for prospect searches
- [ ] Prospect controller for management
- [ ] Enrichment controller for data enhancement

### Day 6-7: Integration Testing
- [ ] End-to-end API tests
- [ ] Database integration tests
- [ ] Performance testing

## 🔗 Related Documentation

- [ContactOut API Documentation](../CONTACTOUT%20docs/contact_out_api_doc.md)
- [8-Week Development Plan](../CONTACTOUT%20docs/8_WEEK_DEVELOPMENT_PLAN.md)
- [Integration Master Plan](../CONTACTOUT%20docs/REACHLY_CONTACTOUT_INTEGRATION_MASTER_PLAN.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Use TypeScript strictly
5. Follow the logging patterns

## 📄 License

MIT License - See main Reachly license for details.

---

**Status**: ✅ Day 1 Complete - Ready for Day 2!  
**Next**: Database schema design and API controller implementation
=======
# lead-generation-service
>>>>>>> 86e71ab57be083d5622c48bca4f7b668515df081
