export interface ActivityUser {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Activity {
  _id: string;

  userId?: ActivityUser | null;

  type:
    | "skill_created"
    | "skill_deleted"
    | "progress_added"
    | "achievement_unlocked"
    | "ticket_created"
    | "ticket_replied"
    | "login"
    | "logout"
    | "security_alert"
    | "email_sent"
    | "ai_used";

  title: string;

  description?: string;

  metadata?: any;

  severity:
    | "info"
    | "success"
    | "warning"
    | "danger";

  createdAt: string;

  updatedAt?: string;
}