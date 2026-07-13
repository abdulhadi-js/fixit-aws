locals {
  name_prefix = "${var.project}-${var.environment}"
}

# ─── KMS key for encrypting RDS and secrets ────────────────────────────────────
module "kms" {
  source      = "./modules/kms"
  name_prefix = local.name_prefix
  environment = var.environment
}

# ─── VPC: subnets, IGW, route tables, NAT gateway ────────────────────────────
module "vpc" {
  source               = "./modules/vpc"
  name_prefix          = local.name_prefix
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# ─── Security Groups ──────────────────────────────────────────────────────────
module "security_groups" {
  source      = "./modules/security-groups"
  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id
  app_port    = var.app_port
}

# ─── ECR: Docker image registry ───────────────────────────────────────────────
module "ecr" {
  source      = "./modules/ecr"
  name_prefix = local.name_prefix
}

# ─── ALB: Application Load Balancer with HTTPS ────────────────────────────────
module "alb" {
  source            = "./modules/alb"
  name_prefix       = local.name_prefix
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_sg_id         = module.security_groups.alb_sg_id
  app_port          = var.app_port
}

# ─── RDS: PostgreSQL Multi-AZ Primary + Standby ───────────────────────────────
module "rds" {
  source             = "./modules/rds"
  name_prefix        = local.name_prefix
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.security_groups.rds_sg_id
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  db_instance_class  = var.db_instance_class
  allocated_storage  = var.db_allocated_storage
  kms_key_id         = module.kms.rds_key_arn
}

# ─── Redis: ElastiCache for sessions/matching ─────────────────────────────────
module "redis" {
  source             = "./modules/redis"
  name_prefix        = local.name_prefix
  private_subnet_ids = module.vpc.private_subnet_ids
  vpc_id             = module.vpc.vpc_id
  ec2_sg_id          = module.security_groups.ec2_sg_id
}

# ─── EC2 Auto Scaling Group ───────────────────────────────────────────────────
module "ec2_asg" {
  source                 = "./modules/ec2-asg"
  name_prefix            = local.name_prefix
  vpc_id                 = module.vpc.vpc_id
  public_subnet_ids      = module.vpc.public_subnet_ids
  ec2_sg_id              = module.security_groups.ec2_sg_id
  instance_type          = var.ec2_instance_type
  ami_id                 = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu.id
  key_pair_name          = var.key_pair_name
  target_group_arn       = module.alb.target_group_arn
  min_size               = var.asg_min_size
  max_size               = var.asg_max_size
  desired_capacity       = var.asg_desired_capacity
  ecr_image_uri          = var.ecr_image_uri != "" ? var.ecr_image_uri : "${module.ecr.repository_url}:latest"
  app_port               = var.app_port
  database_url           = "postgresql://${var.db_username}:${var.db_password}@${module.rds.endpoint}/${var.db_name}?sslmode=require"
  redis_url              = "redis://${try(module.redis.primary_endpoint_address, "pending")}:6379"
  jwt_secret             = var.jwt_secret
  jwt_expiration         = var.jwt_expiration
  jwt_refresh_secret     = var.jwt_refresh_secret
  jwt_refresh_expiration = var.jwt_refresh_expiration
  stripe_secret_key      = var.stripe_secret_key
  stripe_webhook_secret  = var.stripe_webhook_secret
  aws_region             = var.aws_region
}

# ─── CloudWatch: Alarms + Log Groups + Scaling Policies ──────────────────────
module "cloudwatch" {
  source                   = "./modules/cloudwatch"
  name_prefix              = local.name_prefix
  asg_name                 = module.ec2_asg.asg_name
  alb_arn_suffix           = module.alb.alb_arn_suffix
  target_group_arn_suffix  = module.alb.target_group_arn_suffix
  scale_up_policy_arn      = module.ec2_asg.scale_up_policy_arn
  scale_down_policy_arn    = module.ec2_asg.scale_down_policy_arn
  cpu_scale_up_threshold   = var.cpu_scale_up_threshold
  cpu_scale_down_threshold = var.cpu_scale_down_threshold
  alarm_email              = var.alarm_email
}

# ─── S3: Frontend static website ──────────────────────────────────────────────
module "s3_frontend" {
  source      = "./modules/s3-frontend"
  bucket_name = var.frontend_bucket_name
  name_prefix = local.name_prefix
}

# ─── Fallback AMI: Latest Ubuntu 24.04 LTS (used if no Packer AMI yet) ────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
