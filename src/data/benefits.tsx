import { 
    FiUsers, 
    FiZap, 
    FiDatabase, 
    FiMessageSquare, 
    FiTrendingUp, 
    FiSettings, 
    FiBriefcase, 
    FiMonitor 
} from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "AI-Powered Onboarding",
        description: "Seamlessly integrate new employees or clients with automated AI-driven workflows, reducing manual work and accelerating productivity.",
        bullets: [
            {
                title: "Automated Task Assignments",
                description: "AI assigns the right documents, credentials, and tools for new hires instantly.",
                icon: <FiZap size={26} />
            },
            {
                title: "Smart Knowledge Base",
                description: "New employees can ask questions and get instant AI-powered answers from company documentation.",
                icon: <FiMessageSquare size={26} />
            },
            {
                title: "Personalized Onboarding Paths",
                description: "Custom-tailored onboarding based on role, location, and experience.",
                icon: <FiUsers size={26} />
            }
        ],
        imageSrc:  "/images/chat.png"
    },
    {
        title: "Business Process Automation",
        description: "Eliminate repetitive tasks with intelligent AI integrations that connect all your business tools effortlessly.",
        bullets: [
            {
                title: "Workflow Orchestration",
                description: "Seamless integration with Slack, Notion, Asana, and more for automated workflows.",
                icon: <FiSettings size={26} />
            },
            {
                title: "Email & Calendar Automation",
                description: "AI schedules meetings, sends follow-ups, and prioritizes your inbox.",
                icon: <FiMonitor size={26} />
            },
            {
                title: "Cross-Platform Data Sync",
                description: "Automatically sync data between your CRM, databases, and collaboration tools.",
                icon: <FiDatabase size={26} />
            }
        ],
        imageSrc:  "/images/flowchart.png"
    },
    {
        title: "AI-Driven Business Intelligence",
        description: "Make smarter decisions with AI-generated insights, predictive analytics, and automated reporting.",
        bullets: [
            {
                title: "Conversational Data Insights",
                description: "Ask AI questions about your business data and get real-time responses.",
                icon: <FiTrendingUp size={26} />
            },
            {
                title: "Automated Reporting",
                description: "Daily, weekly, or monthly reports generated and delivered to your inbox.",
                icon: <FiBriefcase size={26} />
            },
            {
                title: "Predictive Performance Analysis",
                description: "Get future trend predictions based on historical data.",
                icon: <FiMonitor size={26} />
            }
        ],
        imageSrc:  "/images/chart.png"
    }
];
