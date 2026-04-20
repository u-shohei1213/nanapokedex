output "api_url" {
  value = module.apigateway.api_endpoint
}

output "eb_url" {
  value = module.elastic_beanstalk.cname
}

output "db_host" {
  value = module.rds.db_host
}

output "db_port" {
  value = module.rds.db_port
}

output "db_name" {
  value = var.db_name
}

output "db_username" {
  value = module.rds.db_username
}