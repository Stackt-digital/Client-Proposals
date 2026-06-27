export type ActionType =
  | "content_approval"
  | "performance_planner"
  | "invoice"
  | "creative_review"
  | "reporting";

export interface ActionItem {
  id: string;
  client_id: string;
  type: ActionType;
  title: string;
  description?: string;
  url?: string;
  status: "pending" | "completed";
  due_date?: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  token: string;
  logo_url?: string;
  hero_image_url?: string;
  about_text?: string;

  // Integration configs
  clickup_list_id?: string;
  statusbrew_url?: string;
  figma_url?: string;
  gomarble_url?: string;
  google_drive_folder_id?: string;
  performance_planner_url?: string;
  strategy_pdf_url?: string;
  xero_invoice_url?: string;

  is_active: boolean;
  created_at: string;
}

export interface PortalData {
  client: Client;
  actions: ActionItem[];
}
