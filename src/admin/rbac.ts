import { UserProfile, UserRole } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, UserProfile['permissions']> = {
  quality_engineer: {
    // Full operational access: enter, edit, sign off and release products.
    canEnterData: true,
    canApproveRelease: true,
    canEditCriticalLimits: false,
    canManageUsers: false,
    canExportReports: true,
    canSignOff: true,
  },
  quality_supervisor: {
    // Review/approval role: no operational data entry.
    canEnterData: false,
    canApproveRelease: true,
    canEditCriticalLimits: false,
    canManageUsers: false,
    canExportReports: true,
    canSignOff: true,
  },
  quality_manager: {
    // Department leadership follows the supervisor approval workflow.
    canEnterData: false,
    canApproveRelease: true,
    canEditCriticalLimits: false,
    canManageUsers: false,
    canExportReports: true,
    canSignOff: true,
  },
  system_admin: {
    // Full system administration and operational access.
    canEnterData: true,
    canApproveRelease: true,
    canEditCriticalLimits: true,
    canManageUsers: true,
    canExportReports: true,
    canSignOff: true,
  },
};

export function permissionsForRole(role: UserRole): UserProfile['permissions'] {
  return { ...ROLE_PERMISSIONS[role] };
}

export function withRolePermissions(user: UserProfile, role: UserRole = user.role): UserProfile {
  return {
    ...user,
    role,
    permissions: permissionsForRole(role),
  };
}

export function isSystemAdmin(user: Pick<UserProfile, 'role'>): boolean {
  return user.role === 'system_admin';
}
