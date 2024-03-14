resource "aws_iam_user" "dingding" {
  name = "crazy-frog-to-prod-speedrun"
}

data "aws_iam_policy" "admin" {
  arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_user_policy_attachment" "crazy_frog_to_prod_attach" {
  user       = aws_iam_user.dingding.name
  policy_arn = data.aws_iam_policy.admin.arn
}
