variable "app_name" {
  type = string
}

variable "repository" {
  type = string
}

variable "branch_name" {
  type = string
}

variable "api_base_url" {
  type = string
}

variable "build_spec" {
  type = string
}

variable "access_token" {
  type      = string
  sensitive = true
}