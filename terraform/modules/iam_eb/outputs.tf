output "eb_ec2_role_name" {
  value = aws_iam_role.eb_ec2.name
}

output "eb_instance_profile_name" {
  value = aws_iam_instance_profile.eb_ec2.name
}

output "eb_service_role_arn" {
  value = aws_iam_role.eb_service.arn
}