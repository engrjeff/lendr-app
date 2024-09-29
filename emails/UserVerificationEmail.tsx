/* eslint-disable tailwindcss/no-custom-classname */
import {
  Body,
  Button,
  Font,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"

export default function UserVerificationEmail({
  name,
  confirmationLink,
}: {
  name: string
  confirmationLink: string
}) {
  const previewText = `Hi, ${name}! Thanks for signing up to Lendr!. We are so glad to have you on board! To get started, click the link below to confirm your registration so you will be able to fully use Lendr.`

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
          <Text>Hi, {name}!</Text>
          <Text>
            Thanks for signing up to Lendr!. We are so glad to have you on
            board!
          </Text>
          <Text>
            To get started, click the link below to confirm your registration
            and you will be able to fully use Lendr.
          </Text>
          <Button
            href={confirmationLink}
            className="rounded bg-purple-600 px-4 py-3 font-medium text-white"
          >
            Confirm your registration
          </Button>
          <Text>Enjoy!</Text>
          <Hr />
          <Text className="text-xs">- jeffsegovia</Text>
        </Body>
      </Tailwind>
    </Html>
  )
}
