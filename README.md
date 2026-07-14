<div align="center">

# 🛠️ FixIt — Home Services Platform

**FixIt** is a full-stack, production-grade home services platform that connects consumers with skilled technicians. It supports real-time job scheduling, secure payments via Stripe, OTP-based authentication, and dedicated dashboards for both consumers and technicians.

[![CI/CD](https://github.com/abdulhadi-js/fixit-aws/actions/workflows/deploy.yml/badge.svg)](https://github.com/abdulhadi-js/fixit-aws/actions/workflows/deploy.yml)
![Node.js](https://img.shields.io/badge/Node.js-24-green)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![AWS](https://img.shields.io/badge/AWS-Deployed-orange)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple)
![License](https://img.shields.io/badge/License-Proprietary-blue)

🌐 **Live App:** [http://fixit-frontend-app.s3-website-ap-southeast-1.amazonaws.com](http://fixit-frontend-app.s3-website-ap-southeast-1.amazonaws.com)

🔌 **API Endpoint:** [http://fixit-production-alb-1117262851.ap-southeast-1.elb.amazonaws.com](http://fixit-production-alb-1117262851.ap-southeast-1.elb.amazonaws.com)

</div>

---

## 📐 Architecture

![FixIt AWS Architecture](./architecture.jpeg)

The application runs on a fully automated, highly available, and scalable AWS Cloud Infrastructure. The frontend is served via S3 + CloudFront CDN for global performance. The backend runs as a Dockerized NestJS API on a fleet of EC2 instances behind an Application Load Balancer. All infrastructure is defined as code using Terraform and deployed via a fully automated GitHub Actions CI/CD pipeline.

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS v4 |
| **Backend** | NestJS 10, TypeScript, Prisma ORM |
| **Database** | PostgreSQL 15 (AWS RDS) |
| **Cache / OTP** | Redis 7 (AWS ElastiCache) |
| **Payments** | Stripe API (Payment Elements + Webhooks) |
| **Containerization** | Docker |
| **Infrastructure** | Terraform |
| **CI/CD** | GitHub Actions |
| **Cloud Provider** | Amazon Web Services (AWS) |

---

## ✨ Core Features

### 👤 Authentication
- Phone number + OTP verification flow
- JWT access tokens and refresh tokens
- Role-based access control (Consumer vs Technician)

### 🛒 Consumer Features
- Browse a full service catalog (Plumbing, Electrical, AC, Cleaning, etc.)
- Book standard services with date, time, and address picker
- Submit **custom job requests** with descriptions and photos
- Choose payment method — **Stripe (online) or Cash on Delivery**
- Consumer dashboard with booking history and real-time status tracking

### 🔧 Technician Features
- Daily job agenda view
- Accept/reject custom job quotes
- Real-time status updates: En-Route → In Progress → Completed
- Weekly earnings ledger and payment history

### 💳 Payments
- Stripe Payment Elements for secure, PCI-compliant credit/debit card processing
- Cash on Delivery option
- Stripe Webhook integration to confirm payments and update booking status

---

## ☁️ AWS Infrastructure

The entire infrastructure is managed by Terraform and stored in a remote S3 backend with DynamoDB state locking.

| AWS Service | Purpose |
|---|---|
| **VPC** | Isolated private network with public & private subnets |
| **Internet Gateway** | Public internet access for the ALB |
| **NAT Gateway** | Outbound internet for private EC2 / RDS / Redis |
| **ALB (Load Balancer)** | Receives API traffic, distributes to healthy EC2 instances |
| **EC2 Auto Scaling Group** | Runs the NestJS backend in Docker, auto-scales on CPU load |
| **Amazon ECR** | Private Docker image registry |
| **Amazon RDS (PostgreSQL)** | Fully managed relational database in private subnet |
| **Amazon ElastiCache (Redis)** | Session caching and OTP storage |
| **Amazon S3** | Hosts the Next.js static frontend + Terraform remote state |
| **Amazon CloudFront** | Global CDN for ultra-fast frontend delivery |
| **AWS KMS** | Encrypts RDS database and Terraform state at rest |
| **Amazon CloudWatch** | Monitors CPU and HTTP 5xx errors |
| **Amazon SNS** | Email alerts on infrastructure anomalies |
| **AWS DynamoDB** | Terraform state locking table |

---

## 🚀 CI/CD Pipeline (GitHub Actions)

The pipeline automatically runs on every `git push` to `main`.

```
git push → main
      │
      ├── 🧪 test-backend  ──┐
      │                      ├──► 🐳 build-backend (Docker → ECR)
      └── 🧪 test-frontend ──┘         │
                                        ▼
                                  🚀 deploy-backend
                                  1. terraform init
                                  2. terraform apply  ← Provisions all backend AWS infra
                                  3. ASG Instance Refresh ← Zero-downtime rolling deploy
                                        │
                             ┌──────────┘
      🏗️ build-frontend ──────►  🚀 deploy-frontend
      (runs in parallel)        1. terraform init
                                2. terraform apply  ← Provisions S3 + CloudFront
                                3. Read S3 bucket from terraform output
                                4. aws s3 sync ← Uploads HTML/JS/CSS
                                5. CloudFront cache invalidation
```

**Pipeline Jobs:**
1. **🧪 Test Backend** — Runs NestJS unit tests + TypeScript compile check
2. **🧪 Test Frontend** — Runs React/Next.js test suite
3. **🐳 Build Backend** — Docker build → tag → push to ECR
4. **🏗️ Build Frontend** — Next.js static export, injects API URL + Stripe public key
5. **🚀 Deploy Backend** — `terraform apply` + ASG rolling instance refresh (zero downtime)
6. **🚀 Deploy Frontend** — `terraform apply` + `aws s3 sync` + CloudFront invalidation

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js 24+](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Stripe CLI](https://docs.stripe.com/stripe-cli) *(optional, for webhook testing)*

### 1. Clone the Repository
```bash
git clone https://github.com/abdulhadi-js/fixit-aws.git
cd fixit-aws
```

### 2. Start Local Databases (PostgreSQL + Redis)
```bash
cd backend
docker-compose up -d
```

### 3. Configure Backend Environment
Create a `.env` file inside `/backend`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fixit
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Run the Backend (NestJS API)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
# ✅ API running at http://localhost:3001
```

### 5. Configure Frontend Environment
Create a `.env.local` file inside `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 6. Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# ✅ UI running at http://localhost:3000
```

---

## 🔐 GitHub Actions Secrets

Add these in **Settings → Secrets and variables → Actions** for the pipeline to work:

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe `pk_test_...` key for the frontend |
| `STRIPE_SECRET_KEY` | Stripe `sk_test_...` key for the backend |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `DB_PASSWORD` | PostgreSQL database password |
| `JWT_SECRET` | JWT access token signing secret |
| `JWT_REFRESH_SECRET` | JWT refresh token signing secret |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID for cache invalidation |

---

## 📁 Project Structure

```
fixit-aws/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # OTP auth, JWT guards
│   │   ├── bookings/         # Job bookings module
│   │   ├── payments/         # Stripe payment module
│   │   ├── services/         # Service catalog module
│   │   └── users/            # User management module
│   ├── prisma/               # Database schema & migrations
│   └── Dockerfile
│
├── frontend/                 # Next.js Frontend
│   ├── src/app/
│   │   ├── (consumer)/       # Consumer-facing pages
│   │   │   ├── checkout/     # Stripe payment page
│   │   │   ├── dashboard/    # Consumer booking dashboard
│   │   │   └── post-job/     # Custom job request flow
│   │   ├── (technician)/     # Technician-facing pages
│   │   │   ├── dashboard/    # Job agenda & status updates
│   │   │   └── earnings/     # Weekly earnings ledger
│   │   ├── login/            # Authentication pages
│   │   └── register/
│   └── public/
│
├── infrastructure/           # Terraform IaC
│   ├── modules/
│   │   ├── vpc/              # VPC, subnets, NAT gateways
│   │   ├── alb/              # Application Load Balancer
│   │   ├── ec2_asg/          # EC2 Auto Scaling Group + Launch Template
│   │   ├── rds/              # PostgreSQL database
│   │   ├── redis/            # ElastiCache Redis
│   │   ├── ecr/              # Container registry
│   │   ├── s3_frontend/      # S3 static website hosting
│   │   ├── cloudwatch/       # Monitoring + SNS alerts
│   │   └── kms/              # Encryption keys
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── backend.tf            # Remote S3 state + DynamoDB locking
│
├── .github/workflows/
│   └── deploy.yml            # Full CI/CD pipeline
│
├── architecture.jpeg         # AWS Architecture Diagram
└── README.md
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved © FixIt 2026.
