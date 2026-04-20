resource "aws_amplify_app" "this" {
  name       = var.app_name
  repository = var.repository
  platform   = "WEB"

  build_spec = var.build_spec

  access_token = var.access_token

  environment_variables = {
    VITE_API_BASE_URL = var.api_base_url
  }

  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "404-200"
  }

  lifecycle {
    ignore_changes = [
      access_token
    ]
  }
}

resource "aws_amplify_branch" "this" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch_name

  stage             = "PRODUCTION"
  enable_auto_build = true
  framework         = "Web"
}