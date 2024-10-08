/* eslint-disable tailwindcss/no-custom-classname */
import {
  Body,
  Button,
  Font,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"

export default function ResetPasswordInstructionEmail({
  passwordResetLink,
}: {
  passwordResetLink: string
}) {
  const previewText = `Click on the button below to reset your password.`

  return (
    <Html>
      <Tailwind>
        <head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />

          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
        </head>
        <Preview>{previewText}</Preview>

        <Body>
          <Heading as="h1">Reset your password</Heading>
          <Text>Click on the button below to reset your password.</Text>
          <Button
            href={passwordResetLink}
            className="rounded bg-purple-600 px-4 py-3 font-medium text-white"
          >
            Reset Password
          </Button>
          <Hr />
          <Text className="text-xs">- jeffsegovia</Text>
        </Body>
      </Tailwind>
    </Html>
  )
}
