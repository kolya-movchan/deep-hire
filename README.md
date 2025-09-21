# 🚀 DeepHire - AI-Powered CV Analysis Platform

> **Intelligent CV Analysis powered by AWS Lambda & Claude Sonnet 3.5 via AWS Bedrock** 🤖

DeepHire is a modern web application that leverages the power of **AWS Lambda functions** integrated with **Claude Sonnet 3.5 through AWS Bedrock** to provide comprehensive CV analysis and candidate matching. The platform analyzes resumes against job descriptions, providing detailed insights, match scores, and hiring recommendations.

## 🏗️ AWS Architecture & AI Integration

### 🔧 AWS Lambda + Claude Sonnet 3.5 Bedrock Integration

The core of DeepHire's intelligence lies in its **serverless AWS architecture**:

- **📄 PDF Processing**: CVs uploaded to S3 trigger Lambda functions that extract text content
- **🧠 AI Analysis**: Lambda functions invoke **Claude Sonnet 3.5** via **AWS Bedrock** for:
  - Candidate profile extraction (skills, experience, education)
  - Job description analysis from provided URLs
  - Intelligent matching algorithms
  - Soft skills assessment
  - Risk analysis and hiring recommendations
- **⚡ Real-time Processing**: GraphQL API powered by AWS AppSync for instant results
- **🔐 Secure Storage**: All data encrypted and stored in AWS services

### 🛠️ AWS Services Stack

- **AWS Lambda**: Serverless compute for CV processing and AI analysis
- **AWS Bedrock**: Access to Claude Sonnet 3.5 for advanced AI capabilities
- **Amazon S3**: Secure file storage for uploaded CVs
- **AWS AppSync**: GraphQL API for real-time data synchronization
- **Amazon Cognito**: User authentication and authorization
- **AWS Amplify**: Full-stack deployment and hosting

## ✨ Key Features

### 🎯 Smart CV Analysis

- **Automated parsing** of PDF resumes with high accuracy
- **Skills extraction** and categorization (technical, soft skills, tools)
- **Experience timeline** analysis with role progression insights
- **Education verification** and relevance scoring

### 🔍 Intelligent Job Matching

- **URL-based job analysis** - paste any job posting URL
- **Match scoring** algorithm (0-100% compatibility)
- **Gap analysis** highlighting missing skills and requirements
- **Experience level** matching with years of experience validation

### 📊 Comprehensive Reports

- **Visual dashboards** with match scores and analytics
- **Detailed breakdowns** of candidate strengths and weaknesses
- **Risk assessment** for potential hiring challenges
- **Actionable recommendations** for hiring decisions

### 💳 Credit-Based System

- **Fair usage** model with credit-based CV analysis (3 credits per analysis)
- **Anonymous access** supported with browser fingerprinting
- **User accounts** for extended features and history tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account with Amplify CLI configured
- AWS Bedrock access for Claude Sonnet 3.5

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd deep-hire

# Install dependencies
npm install

# Configure AWS Amplify
amplify configure
amplify init

# Start development server
npm run dev
```

### 🔧 Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Copy the example file
cp .env.example .env
```

**Required Environment Variables:**

```env
# 🌐 AWS Configuration
VITE_PUBLIC_AWS_REGION=eu-north-1
VITE_PUBLIC_AWS_BUCKET_NAME=your-s3-bucket-name
VITE_PUBLIC_AWS_IDENTITY_POOL_ID=eu-north-1:your-identity-pool-id

# 📡 AWS API & GraphQL Configuration
VITE_AWS_API_URL=https://your-api-gateway-url.amazonaws.com
VITE_APP_SYNC_URL=https://your-appsync-endpoint.appsync-api.eu-north-1.amazonaws.com/graphql
VITE_APP_SYNC_API_KEY=your-appsync-api-key

# 🔍 Fingerprint.js Configuration (for anonymous user tracking)
VITE_FINGERPRINT_API_KEY=your-fingerprintjs-api-key
```

**Variable Descriptions:**

- `VITE_PUBLIC_AWS_REGION`: AWS region where your resources are deployed
- `VITE_PUBLIC_AWS_BUCKET_NAME`: S3 bucket name for CV file uploads
- `VITE_PUBLIC_AWS_IDENTITY_POOL_ID`: Cognito Identity Pool ID for authentication
- `VITE_AWS_API_URL`: API Gateway endpoint URL for REST API calls
- `VITE_APP_SYNC_URL`: AWS AppSync GraphQL endpoint URL
- `VITE_APP_SYNC_API_KEY`: AppSync API key for GraphQL authentication
- `VITE_FINGERPRINT_API_KEY`: FingerprintJS API key for anonymous user tracking

## 🏗️ Project Structure

```
src/
├── 📁 api/                    # API layer
│   ├── graphql/              # GraphQL queries, mutations, types
│   └── rest/                 # REST API utilities
├── 📁 components/            # Reusable UI components
├── 📁 hooks/                 # Custom React hooks
│   ├── auth/                 # Authentication hooks
│   ├── use-cv-analysis.ts    # CV analysis logic
│   ├── use-file-upload.ts    # S3 file upload handling
│   └── use-visitor-verification.ts
├── 📁 pages/                 # Application pages/routes
│   ├── index.tsx             # Home page with upload
│   ├── cv-analyses.tsx       # Analysis history
│   ├── cv-analysis-of-candidate.tsx  # Detailed results
│   ├── Login.tsx & Register.tsx      # Authentication
│   └── profile.tsx           # User profile
├── 📁 store/                 # Redux state management
│   ├── auth-slice.ts         # Authentication state
│   ├── credits-slice.ts      # Credit system
│   ├── cv-slice.ts          # CV upload state
│   └── candidate-analyses-slice.ts   # Analysis results
├── 📁 types/                 # TypeScript type definitions
└── 📁 utils/                 # Utility functions
```

## 🔄 How It Works

### 1. 📤 Upload Process

```typescript
// User uploads CV + job URL
const { fileUrl, fileSlug } = await uploadFile(resumeFile, vacancyUrl, userId)
// File stored in S3 with metadata
```

### 2. 🤖 AI Processing

```typescript
// Lambda function triggered by S3 upload
// Claude Sonnet 3.5 via Bedrock analyzes:
// - CV content extraction
// - Job requirements parsing
// - Intelligent matching algorithm
```

### 3. 📊 Results Display

```typescript
// Real-time polling for analysis results
const { candidateData, matchingData } = useCvAnalysis(fileSlug)
// Display comprehensive analysis dashboard
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (port 3001)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run preview      # Preview production build
```

## 🎨 Tech Stack

### Frontend

- **⚛️ React 18** with TypeScript
- **🎨 Material-UI** + **Tailwind CSS** for styling
- **🔄 Redux Toolkit** for state management
- **🚀 Vite** for fast development and building

### Backend & Cloud

- **☁️ AWS Amplify** for full-stack deployment
- **🔧 AWS Lambda** for serverless compute
- **🧠 AWS Bedrock** with Claude Sonnet 3.5
- **📊 GraphQL** with AWS AppSync
- **🗄️ Amazon S3** for file storage

### Development Tools

- **📝 ESLint** + **Prettier** for code quality
- **🐕 Husky** for git hooks
- **📱 Responsive design** with mobile-first approach

## 🔐 Security & Privacy

- **🔒 Secure file upload** with pre-signed S3 URLs
- **👤 User authentication** via AWS Cognito
- **🕵️ Anonymous usage** supported with privacy-focused fingerprinting
- **🛡️ Data encryption** at rest and in transit
- **⏰ Automatic cleanup** of temporary files and data

## 🚀 Deployment

The application is configured for deployment on **AWS Amplify**:

```bash
# Deploy to AWS
amplify push

# Deploy frontend only
amplify publish
```

## 📈 Performance Features

- **⚡ Lazy loading** for optimal bundle size
- **🔄 Real-time updates** with GraphQL subscriptions
- **📱 Progressive Web App** capabilities
- **🎯 Optimized Lambda** cold start performance
- **📊 Efficient state management** with Redux Toolkit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- 📧 Create an issue in this repository
- 📖 Check the documentation in `/docs`
- 💬 Join our community discussions

---

**Built with ❤️ using AWS Lambda, Claude Sonnet 3.5, and modern React** 🚀
