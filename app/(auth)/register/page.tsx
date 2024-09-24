import { Metadata } from "next"

import { SignUpForm } from "../components/SignUpForm"

export const metadata: Metadata = {
  title: "Sign Up",
}

function RegisterPage() {
  return <SignUpForm />
}

export default RegisterPage
