// import { ConnectionProviderProps } from '@/providers/connections-provider'
import { z } from "zod";

export interface IMenuItem {
  text: string;
  url: string;
}

export interface IBenefit {
  title: string;
  description: string;
  imageSrc: string;
  bullets: IBenefitBullet[];
}

export interface IBenefitBullet {
  title: string;
  description: string;
  icon: JSX.Element;
}

export interface IPricing {
  name: string;
  price: number | string;
  features: string[];
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ITeamMember {
  name: string;
  role: string;
  avatar: string;
  socials: {
    name: string;
    icon: string;
    link: string;
  }[];
}

export interface IStats {
  title: string;
  icon: JSX.Element;
  description: string;
}

export interface ISocials {
  facebook?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  threads?: string;
  twitter?: string;
  youtube?: string;
  x?: string;
  [key: string]: string | undefined;
}

export const EditUserProfileSchema = z.object({
  email: z.string().email("Required"),
  name: z.string().min(1, "Required"),
});

export const WorkflowFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type ConnectionTypes = "Google Drive" | "Notion" | "Slack" | "Discord";

export type Connection = {
  title: ConnectionTypes;
  description: string;
  image: string;
  // connectionKey: keyof ConnectionProviderProps
  accessTokenKey?: string;
  alwaysTrue?: boolean;
  slackSpecial?: boolean;
};

export type EditorCanvasTypes =
  | "Email"
  | "Condition"
  | "AI"
  | "Slack"
  | "Google Drive"
  | "Notion"
  | "Custom Webhook"
  | "Google Calendar"
  | "Trigger"
  | "Action"
  | "Wait";

// export type EditorCanvasCardType = {
//   title: string;
//   description: string;
//   completed: boolean;
//   current: boolean;
//   metadata: any;
//   type: EditorCanvasTypes;
// };

// export type EditorNodeType = {
//   id: string;
//   type: EditorCanvasCardType["type"];
//   position: {
//     x: number;
//     y: number;
//   };
//   data: EditorCanvasCardType;
// };

// export type EditorNode = EditorNodeType;

// export type EditorActions =
//   | {
//       type: "LOAD_DATA";
//       payload: {
//         elements: EditorNode[];
//         edges: {
//           id: string;
//           source: string;
//           target: string;
//         }[];
//       };
//     }
//   | {
//       type: "UPDATE_NODE";
//       payload: {
//         elements: EditorNode[];
//       };
//     }
//   | { type: "REDO" }
//   | { type: "UNDO" }
//   | {
//       type: "SELECTED_ELEMENT";
//       payload: {
//         element: EditorNode;
//       };
//     };

export const nodeMapper: Record<string, string> = {
  Notion: "notionNode",
  Slack: "slackNode",
  Discord: "discordNode",
  "Google Drive": "googleNode",
};
