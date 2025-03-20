import { BsLightningFill, BsFillPeopleFill, BsShieldLockFill } from "react-icons/bs";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "10K+",
        icon: <BsLightningFill size={34} className="text-primary" />,
        description: "Automated workflows executed daily, streamlining operations effortlessly."
    },
    {
        title: "500+",
        icon: <BsFillPeopleFill size={34} className="text-secondary" />,
        description: "Businesses trust Docta to optimize their onboarding and workflow processes."
    },
    {
        title: "99.9%",
        icon: <BsShieldLockFill size={34} className="text-green-600" />,
        description: "Uptime reliability ensures uninterrupted automation and data security."
    },
];
