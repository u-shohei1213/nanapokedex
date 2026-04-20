output "rds_sg_id" {
  value = aws_security_group.rds.id
}

output "eb_ec2_sg_id" {
  value = aws_security_group.eb_ec2.id
}