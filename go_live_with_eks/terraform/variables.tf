variable "aws_region" {
  description = "The AWS region where resources will be created."
  type        = string
  default     = "ap-south-1" # Mumbai region
}

variable "cluster_name" {
  description = "The name of the EKS cluster."
  type        = string
  default     = "nodejs-app-cluster"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_managed_node_groups" {
  description = "Map of EKS managed node groups and their configurations"
  type = map(object({
    name           = string
    capacity_type  = string
    instance_types = list(string)
    min_size       = number
    max_size       = number
    desired_size   = number
  }))
  default = {
    spot_nodes = {
      name           = "spot-node-group"
      capacity_type  = "SPOT"
      instance_types = ["t3.small"]
      min_size       = 1
      max_size       = 3
      desired_size   = 3
    }
  }
}
