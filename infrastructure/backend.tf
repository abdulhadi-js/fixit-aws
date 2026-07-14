# Remote state stored in S3, locked with native S3 lockfile (Terraform 1.15+)
terraform {
  backend "s3" {
    bucket         = "fixit-terraform-state-ap-southeast-1"
    key            = "production/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    use_lockfile   = true
  }
}
