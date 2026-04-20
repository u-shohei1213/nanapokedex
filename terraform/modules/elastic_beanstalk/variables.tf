variable "app_name" {
  type = string
}

variable "env_name" {
  type = string
}

variable "platform_arn" {
  type = string
}

variable "tier_name" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "iam_instance_profile" {
  type = string
}

variable "service_role" {
  type = string
}

variable "ec2_security_group_id" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "instance_subnets" {
  type = string
}

variable "elb_subnets" {
  type = string
}

variable "backend_cors_origins" {
  type = string
}

variable "cookie_samesite" {
  type = string
}

variable "cookie_secure" {
  type = string
}

variable "db_host" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_port" {
  type = string
}

variable "db_user" {
  type = string
}

variable "pythonpath" {
  type = string
}