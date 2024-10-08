import UserVerificationEmail from "@/emails/UserVerificationEmail"
import { Resend } from "resend"

import ResetPasswordInstructionEmail from "./ResetPasswordInstructionEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string
) {
  const confirmationLink = `${process.env.SITE_URL}/verify/${token}`

  await resend.emails.send({
    from: "Lendr <admin@lendr.jeffsegovia.dev>",
    to: email,
    subject: "Confirm your email",
    react: (
      <UserVerificationEmail name={name} confirmationLink={confirmationLink} />
    ),
  })
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const passwordResetLink = `${process.env.SITE_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: "Lendr <admin@lendr.jeffsegovia.dev>",
    to: email,
    subject: "Reset your Lendr password",
    react: (
      <ResetPasswordInstructionEmail passwordResetLink={passwordResetLink} />
    ),
  })
}
