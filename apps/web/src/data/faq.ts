import { IFAQ } from "@/types";
import { siteDetails } from "./siteDetails";

export const faqs: IFAQ[] = [
  {
    question: `How does ${siteDetails.siteName} automate workflows?`,
    answer:
      "Docta integrates with your favorite business tools, automating repetitive tasks such as onboarding, task assignments, reporting, and cross-platform data sync to improve efficiency.",
  },
  {
    question: `Which apps does ${siteDetails.siteName} support?`,
    answer:
      "Docta connects with 100+ enterprise tools, including Slack, Notion, Jira, Google Workspace, Asana, Trello, and more. If you need a custom integration, we can support that too!",
  },
  {
    question: `Can I customize automation rules in ${siteDetails.siteName}?`,
    answer:
      "Absolutely! You can define automation triggers, conditions, and actions that align with your business processes. Our AI adapts to your workflow needs.",
  },
  {
    question: `Is my data secure with ${siteDetails.siteName}?`,
    answer:
      "Yes! Docta uses end-to-end encryption and follows strict security protocols to protect your data. We also provide role-based access control and audit logs.",
  },
  {
    question: "Does Docta require coding knowledge?",
    answer:
      "No coding required! Our intuitive no-code interface allows you to set up workflows easily. For advanced users, we support API integrations and custom scripts.",
  },
  {
    question: `Can ${siteDetails.siteName} handle large-scale automation?`,
    answer:
      "Yes! Docta is built to scale, handling thousands of tasks across different teams and departments while ensuring efficiency and reliability.",
  },
  {
    question: `What kind of support does ${siteDetails.siteName} offer?`,
    answer:
      "We offer 24/7 support via live chat, email, and a dedicated knowledge base with tutorials and guides to help you maximize your automation setup.",
  },
];
