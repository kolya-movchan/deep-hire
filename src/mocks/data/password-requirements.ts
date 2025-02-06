import { PasswordRequirement } from "@/types/signup"

export const passwordRequirements: PasswordRequirement[] = [
  {
    text: "Minimum 8 characters",
    regex: /.{8,}/,
    met: false,
  },
  {
    text: "At least 1 number",
    regex: /\d/,
    met: false,
  },
  {
    text: "At least 1 lowercase letter",
    regex: /[a-z]/,
    met: false,
  },
  {
    text: "At least 1 uppercase letter",
    regex: /[A-Z]/,
    met: false,
  },
  {
    text: "At least 1 special character ($*.[]{}-!@#/\\,><':;_~+=)",
    regex: /[$*.[\]{}\-!@#/\\,><':;_~+=]/,
    met: false,
  },
]
