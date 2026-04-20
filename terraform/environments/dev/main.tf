module "rds" {
  source = "../../modules/rds"

  project_name = var.project_name
  db_username  = var.db_username
  db_password  = var.db_password

  security_group_ids = [
    module.security_group.rds_sg_id
  ]
}

module "security_group" {
  source = "../../modules/security_group"

  project_name  = var.project_name
  vpc_id        = var.vpc_id
  db_admin_cidr = var.db_admin_cidr
  eb_ssh_cidr   = var.eb_ssh_cidr
}

module "elastic_beanstalk" {
  source = "../../modules/elastic_beanstalk"

  app_name     = var.eb_app_name
  env_name     = var.eb_env_name
  platform_arn = var.eb_platform_arn
  tier_name    = var.eb_tier_name

  instance_type        = var.eb_instance_type
  iam_instance_profile = module.iam_eb.eb_instance_profile_name
  service_role         = module.iam_eb.eb_service_role_arn

  ec2_security_group_id = module.security_group.eb_ec2_sg_id

  vpc_id = var.vpc_id

  instance_subnets = var.eb_instance_subnets
  elb_subnets      = var.eb_elb_subnets

  backend_cors_origins = var.backend_cors_origins

  cookie_samesite = var.cookie_samesite
  cookie_secure   = var.cookie_secure

  db_host     = module.rds.db_endpoint
  db_name     = var.db_name
  db_password = var.db_password
  db_port     = var.db_port
  db_user     = var.db_user

  pythonpath = var.pythonpath
}

module "apigateway" {
  source = "../../modules/apigateway"

  api_name        = var.apigw_api_name
  integration_uri = "http://${lower(module.elastic_beanstalk.cname)}/{proxy}"
}

module "amplify" {
  source = "../../modules/amplify"

  app_name     = var.amplify_app_name
  repository   = var.amplify_repository
  branch_name  = var.amplify_branch_name
  api_base_url = module.apigateway.api_endpoint
  build_spec   = file("${path.module}/amplify-buildspec.yml")
  access_token = var.amplify_access_token
}

module "iam_eb" {
  source = "../../modules/iam_eb"

  eb_ec2_role_name         = var.eb_ec2_role_name
  eb_instance_profile_name = var.eb_instance_profile_name
  eb_service_role_name     = var.eb_service_role_name
}