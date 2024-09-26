import {
  BanknoteIcon,
  BookIcon,
  CarFrontIcon,
  CreditCardIcon,
  HeartPulseIcon,
  LandmarkIcon,
  PiggyBankIcon,
  PodcastIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react"

export const categories = [
  {
    name: "Credit Card",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-500",
    textColor: "text-purple-500",
    icon: <CreditCardIcon className="size-5" />,
    chartColor: "#6366f1",
  },
  {
    name: "Auto Loan",
    borderColor: "border-sky-500",
    bgColor: "bg-sky-500",
    textColor: "text-sky-500",
    icon: <CarFrontIcon className="size-5" />,
    chartColor: "#0ea5e9",
  },
  {
    name: "Bills",
    borderColor: "border-lime-500",
    bgColor: "bg-lime-500",
    textColor: "text-lime-500",
    icon: <BanknoteIcon className="size-5" />,
    chartColor: "#84cc16",
  },
  {
    name: "Subscription",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
    icon: <PodcastIcon className="size-5" />,
    chartColor: "#3b82f6",
  },
  {
    name: "Personal Loan",
    borderColor: "border-green-500",
    bgColor: "bg-green-500",
    textColor: "text-green-500",
    icon: <UserIcon className="size-5" />,
    chartColor: "#22c55e",
  },
  {
    name: "Student Loan",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-500",
    icon: <BookIcon className="size-5" />,
    chartColor: "#f59e0b",
  },
  {
    name: "Mortgage",
    borderColor: "border-cyan-500",
    bgColor: "bg-cyan-500",
    textColor: "text-cyan-500",
    icon: <LandmarkIcon className="size-5" />,
    chartColor: "#06b6d4",
  },
  {
    name: "Insurance",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-500",
    textColor: "text-orange-500",
    icon: <ShieldCheckIcon className="size-5" />,
    chartColor: "#f97316",
  },
  {
    name: "Medical Loan",
    borderColor: "border-red-500",
    bgColor: "bg-red-500",
    textColor: "text-red-500",
    icon: <HeartPulseIcon className="size-5" />,
    chartColor: "#ef4444",
  },
  {
    name: "Taxes",
    borderColor: "border-indigo-500",
    bgColor: "bg-indigo-500",
    textColor: "text-indigo-500",
    icon: <WalletIcon className="size-5" />,
    chartColor: "#6366f1",
  },
  {
    name: "Other",
    borderColor: "border-gray-500",
    bgColor: "bg-gray-500",
    textColor: "text-gray-500",
    icon: <PiggyBankIcon className="size-5" />,
    chartColor: "#6b7280",
  },
]
