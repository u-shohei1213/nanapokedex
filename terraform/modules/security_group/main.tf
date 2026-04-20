resource "aws_security_group" "eb_ec2" {
  name        = "${var.project_name}-eb-ec2-sg"
  description = "Security group for Elastic Beanstalk EC2"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "eb_http" {
  security_group_id = aws_security_group.eb_ec2.id
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "eb_ssh" {
  count = var.eb_ssh_cidr == "" ? 0 : 1

  security_group_id = aws_security_group.eb_ec2.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  cidr_ipv4         = var.eb_ssh_cidr
}

resource "aws_vpc_security_group_egress_rule" "eb_all" {
  security_group_id = aws_security_group.eb_ec2.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_eb" {
  security_group_id            = aws_security_group.rds.id
  referenced_security_group_id = aws_security_group.eb_ec2.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_admin" {
  security_group_id = aws_security_group.rds.id
  ip_protocol       = "tcp"
  from_port         = 5432
  to_port           = 5432
  cidr_ipv4         = var.db_admin_cidr
}

resource "aws_vpc_security_group_egress_rule" "rds_all" {
  security_group_id = aws_security_group.rds.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}