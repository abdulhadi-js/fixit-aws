packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "region" {
  type    = string
  default = "ap-southeast-1"
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "fixit-backend-{{timestamp}}"
  instance_type = "t3.small"
  region        = var.region
  
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"] # Canonical
  }
  
  ssh_username = "ubuntu"
}

build {
  name    = "fixit-packer"
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "shell" {
    script = "./setup.sh"
  }
}
