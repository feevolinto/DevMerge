import { 
  User, 
  Group, 
  Tag, 
  GroupMember, 
  Notification,
  Role,
  NotificationType 
} from "@prisma/client";

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor?: string;
    hasMore: boolean;
    total?: number;
  };
}

// ============================================
// USER TYPES
// ============================================

export type SafeUser = Omit<User, "password">;

export interface UserProfile extends SafeUser {
  _count?: {
    groups: number;
    memberships: number;
  };
}

// ============================================
// GROUP TYPES
// ============================================

export interface GroupWithRelations extends Group {
  creator: SafeUser;
  tags: {
    tag: Tag;
  }[];
  _count: {
    members: number;
  };
}

export interface GroupDetail extends Group {
  creator: SafeUser;
  tags: {
    tag: Tag;
  }[];
  members: {
    id: string;
    role: Role;
    joinedAt: Date;
    user: SafeUser;
  }[];
}

export interface GroupCard {
  id: string;
  title: string;
  description: string;
  timeline: string | null;
  createdAt: Date;
  creator: {
    id: string;
    name: string;
    username: string;
    profileImage: string | null;
  };
  tags: string[];
  memberCount: number;
  isActive: boolean;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface NotificationWithDetails extends Notification {
  actor?: SafeUser;
  group?: Group;
}

// ============================================
// MEMBERSHIP TYPES
// ============================================

export interface MembershipWithUser extends GroupMember {
  user: SafeUser;
}

export interface MembershipWithGroup extends GroupMember {
  group: Group;
}

// ============================================
// SEARCH & FILTER TYPES
// ============================================

export interface GroupFilters {
  search?: string;
  tag?: string;
  creatorId?: string;
}

export interface UserFilters {
  search?: string;
}

// ============================================
// SESSION TYPES
// ============================================

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage?: string | null;
}

// ============================================
// FORM INPUT TYPES
// ============================================

export interface CreateGroupFormData {
  title: string;
  description: string;
  timeline?: string;
  tags?: string[];
}

export interface UpdateGroupFormData {
  title?: string;
  description?: string;
  timeline?: string;
  isActive?: boolean;
  tags?: string[];
}

export interface UpdateProfileFormData {
  name?: string;
  username?: string;
  bio?: string | null;
  profileImage?: string | null;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// EXPORT PRISMA TYPES
// ============================================

export type { Role, NotificationType };
