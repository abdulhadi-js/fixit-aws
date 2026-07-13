# Remote state stored in S3, locked with DynamoDB
# Run bootstrap/init-state.sh ONCE before `terraform init`
terraform {
  backend "s3" {
    bucket         = "fixit-terraform-state-ap-southeast-1"
    key            = "production/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "fixit-terraform-locks"
  }
}
