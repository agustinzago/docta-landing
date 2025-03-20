import { IPricing } from "@/types";

export const tiers: IPricing[] = [
  {
    name: "Pro",
    price: 49,
    features: [
      "10 active workflows",
      "Up to 25,000 task executions per month",
      "Integration with Slack, Notion, Asana, Google, Gmail",
      "AI-Powered Onboarding",
      "Email support",
    ],
  },
  {
    name: "Business",
    price: 149,
    features: [
      "50 active workflows",
      "Up to 100,000 task executions per month",
      "Advanced integrations with CRMs and databases",
      "AI-Powered Onboarding + Business Process Automation",
      "Smart Knowledge Base with AI",
      "Automated reports and predictive analytics",
      "Priority email & chat support (24/5)",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited workflows & task executions",
      "Custom integrations & private API access",
      "AI-Driven Business Intelligence with advanced prediction models",
      "Enhanced security (SSO, SOC2, GDPR compliance)",
      "Personalized onboarding & consulting",
      "Dedicated 24/7 support",
    ],
  },
];
