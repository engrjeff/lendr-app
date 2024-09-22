import { Metadata } from "next"

import { LoginForm } from "../components/LoginForm"

export const metadata: Metadata = {
  title: "Sign In",
}

function SignInPage() {
  return <LoginForm />
}

export default SignInPage
