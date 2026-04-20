variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "db_admin_cidr" {
  type = string
}

variable "eb_ssh_cidr" {
  type    = string
  default = ""
}