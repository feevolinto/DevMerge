import { prisma } from "./prisma";
import { Role } from "@prisma/client";

// ============================================
// PERMISSION CHECKER FUNCTIONS
// ============================================

/**
 * Check if a user is the creator/leader of a group
 */
export async function isGroupLeader(userId: string, groupId: string): Promise<boolean> {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { creatorId: true },
  });

  return group?.creatorId === userId;
}

/**
 * Check if a user is a member of a group (including leader)
 */
export async function isGroupMember(userId: string, groupId: string): Promise<boolean> {
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  return !!membership;
}

/**
 * Get user's role in a group
 */
export async function getUserGroupRole(
  userId: string,
  groupId: string
): Promise<Role | null> {
  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
    select: { role: true },
  });

  return membership?.role ?? null;
}

/**
 * Check if a user can edit a group
 */
export async function canEditGroup(userId: string, groupId: string): Promise<boolean> {
  return isGroupLeader(userId, groupId);
}

/**
 * Check if a user can delete a group
 */
export async function canDeleteGroup(userId: string, groupId: string): Promise<boolean> {
  return isGroupLeader(userId, groupId);
}

/**
 * Check if a user can join a group
 */
export async function canJoinGroup(userId: string, groupId: string): Promise<boolean> {
  // User cannot join if already a member
  const isMember = await isGroupMember(userId, groupId);
  if (isMember) return false;

  // Check if group exists and is active
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { isActive: true },
  });

  return group?.isActive ?? false;
}

/**
 * Check if a user can leave a group
 */
export async function canLeaveGroup(userId: string, groupId: string): Promise<boolean> {
  // Leaders cannot leave their own group
  const isLeader = await isGroupLeader(userId, groupId);
  if (isLeader) return false;

  // Must be a member to leave
  return isGroupMember(userId, groupId);
}

/**
 * Check if a user can view group members
 */
export async function canViewGroupMembers(userId: string, groupId: string): Promise<boolean> {
  // Leaders can always view members
  const isLeader = await isGroupLeader(userId, groupId);
  if (isLeader) return true;

  // Regular members can view basic info
  return isGroupMember(userId, groupId);
}

// ============================================
// PERMISSION ERROR CLASSES
// ============================================

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

// ============================================
// PERMISSION GUARD DECORATORS
// ============================================

/**
 * Ensure user is authenticated
 */
export function requireAuth(userId: string | null | undefined): asserts userId is string {
  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }
}

/**
 * Ensure user is the group leader
 */
export async function requireGroupLeader(userId: string, groupId: string): Promise<void> {
  const isLeader = await isGroupLeader(userId, groupId);
  if (!isLeader) {
    throw new ForbiddenError("Only group leaders can perform this action");
  }
}

/**
 * Ensure user is a group member
 */
export async function requireGroupMember(userId: string, groupId: string): Promise<void> {
  const isMember = await isGroupMember(userId, groupId);
  if (!isMember) {
    throw new ForbiddenError("You must be a group member to perform this action");
  }
}
