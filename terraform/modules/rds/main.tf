resource "aws_db_instance" "this" {
  identifier                    = "nanapokedex"
  engine                        = "postgres"
  engine_version                = "17.6"
  instance_class                = "db.t4g.micro"
  allocated_storage             = 20
  storage_type                  = "gp2"

  username                      = var.db_username
  password                      = var.db_password

  publicly_accessible           = true
  skip_final_snapshot           = true
  deletion_protection           = false
  backup_retention_period       = 1
  max_allocated_storage         = 1000
  monitoring_interval           = 0
  performance_insights_enabled  = true
  storage_encrypted             = true

  vpc_security_group_ids        = var.security_group_ids

  lifecycle {
    ignore_changes = [
      password
    ]
  }
}