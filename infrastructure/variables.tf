# ─── Global ────────────────────────────────────────────────────────────────────
variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "Deployment environment (production, staging)"
  type        = string
  default     = "production"
}

variable "project" {
  description = "Project name used in resource naming"
  type        = string
  default     = "fixit"
}

# ─── VPC ──────────────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of AZs to deploy into"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

# ─── EC2 / ASG ─────────────────────────────────────────────────────────────────
variable "ec2_instance_type" {
  description = "EC2 instance type for the backend API"
  type        = string
  default     = "t3.small"
}

variable "asg_min_size" {
  description = "Minimum number of EC2 instances in the ASG"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum number of EC2 instances in the ASG"
  type        = number
  default     = 4
}

variable "asg_desired_capacity" {
  description = "Desired number of EC2 instances in the ASG"
  type        = number
  default     = 2
}

variable "ami_id" {
  description = "AMI ID built by Packer (updated on each deploy)"
  type        = string
  default     = "" # Will be set by CI/CD pipeline via -var flag
}

variable "key_pair_name" {
  description = "EC2 key pair name for SSH access (for debugging only)"
  type        = string
  default     = "fixit-keypair"
}

# ─── RDS ──────────────────────────────────────────────────────────────────────
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "fixit"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "fixit_admin"
  sensitive   = true
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "Initial storage allocation in GB"
  type        = number
  default     = 20
}

# ─── Application ──────────────────────────────────────────────────────────────
variable "app_port" {
  description = "Port the NestJS app listens on"
  type        = number
  default     = 3001
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "jwt_expiration" {
  description = "JWT access token expiration"
  type        = string
  default     = "7d"
}

variable "jwt_refresh_secret" {
  description = "JWT refresh token signing secret"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_expiration" {
  description = "JWT refresh token expiration"
  type        = string
  default     = "30d"
}

variable "stripe_secret_key" {
  description = "Stripe secret API key"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook signing secret"
  type        = string
  sensitive   = true
}

variable "ecr_image_uri" {
  description = "Full ECR image URI (registry/repo:tag) for the backend"
  type        = string
  default     = ""
}

# ─── Frontend / S3 ────────────────────────────────────────────────────────────
variable "frontend_bucket_name" {
  description = "S3 bucket name for the static frontend"
  type        = string
  default     = "fixit-frontend-app"
}

# ─── CloudWatch ───────────────────────────────────────────────────────────────
variable "alarm_email" {
  description = "Email address for CloudWatch alarm notifications"
  type        = string
  default     = ""
}

variable "cpu_scale_up_threshold" {
  description = "CPU % that triggers ASG scale-up"
  type        = number
  default     = 70
}

variable "cpu_scale_down_threshold" {
  description = "CPU % that triggers ASG scale-down"
  type        = number
  default     = 30
}
