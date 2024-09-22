import { Metadata } from "next"

import { SignUpForm } from "../components/SignUpForm"

export const metadata: Metadata = {
  title: "Create Your Account",
}

function RegisterPage() {
  return <SignUpForm />
}

export default RegisterPage
