export type UserRole = "staff" | "manager" | "viewer";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
};
