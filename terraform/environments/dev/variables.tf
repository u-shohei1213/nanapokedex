variable "aws_region" {
  type = string
}

variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type = string
}

variable "db_port" {
  type = string
}

variable "db_user" {
  type = string
}

variable "cookie_samesite" {
  type = string
}

variable "cookie_secure" {
  type = string
}

variable "backend_cors_origins" {
  type = string
}

variable "pythonpath" {
  type = string
}

variable "eb_app_name" {
  type = string
}

variable "eb_env_name" {
  type = string
}

variable "eb_platform_arn" {
  type = string
}

variable "eb_tier_name" {
  type = string
}

variable "eb_instance_type" {
  type = string
}

variable "eb_iam_instance_profile" {
  type = string
}

variable "eb_service_role" {
  type = string
}

variable "eb_instance_subnets" {
  type = string
}

variable "eb_elb_subnets" {
  type = string
}

variable "apigw_api_name" {
  type = string
}

variable "amplify_app_name" {
  type = string
}

variable "amplify_repository" {
  type = string
}

variable "amplify_branch_name" {
  type = string
}

variable "amplify_access_token" {
  type      = string
  sensitive = true
}

variable "eb_ec2_role_name" {
  type = string
}

variable "eb_instance_profile_name" {
  type = string
}

variable "eb_service_role_name" {
  type = string
}

variable "db_admin_cidr" {
  type = string
}

variable "eb_ssh_cidr" {
  type = string
}