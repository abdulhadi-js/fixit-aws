output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer (use this as your API endpoint)"
  value       = module.alb.dns_name
}

output "alb_zone_id" {
  description = "Route 53 zone ID of the ALB (for Route 53 alias records)"
  value       = module.alb.zone_id
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing Docker images"
  value       = module.ecr.repository_url
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (private, only accessible from EC2)"
  value       = module.rds.endpoint
  sensitive   = true
}

output "rds_database_url" {
  description = "Full PostgreSQL connection string for the DATABASE_URL env var"
  value       = "postgresql://${var.db_username}:${var.db_password}@${module.rds.endpoint}/${var.db_name}?sslmode=require"
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis ElastiCache primary endpoint address"
  value       = module.redis.primary_endpoint_address
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs (for ALB and EC2)"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs (for RDS)"
  value       = module.vpc.private_subnet_ids
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = module.ec2_asg.asg_name
}

output "frontend_bucket_name" {
  description = "S3 bucket name for the static frontend"
  value       = module.s3_frontend.bucket_name
}

output "frontend_website_endpoint" {
  description = "S3 static website endpoint"
  value       = module.s3_frontend.website_endpoint
}

output "kms_rds_key_arn" {
  description = "KMS key ARN used for RDS encryption"
  value       = module.kms.rds_key_arn
}
