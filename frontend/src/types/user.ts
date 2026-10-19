export interface CurrentUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
}
