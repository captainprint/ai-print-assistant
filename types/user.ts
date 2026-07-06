export type UserRole = "user" | "admin";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
};
