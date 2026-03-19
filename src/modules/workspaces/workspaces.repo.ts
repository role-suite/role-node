import { authRepo, type MembershipRole } from "../auth/auth.repo.js";

export const workspacesRepo = {
  findUserById: authRepo.findUserById,
  findUserByEmail: authRepo.findUserByEmail,
  createWorkspace: authRepo.createWorkspace,
  findWorkspaceById: authRepo.findWorkspaceById,
  createMembership: authRepo.createMembership,
  findMembershipByUserAndWorkspace: authRepo.findMembershipByUserAndWorkspace,
  listMembershipsByUser: authRepo.listMembershipsByUser,
  listMembershipsByWorkspace: authRepo.listMembershipsByWorkspace,
  updateMembershipRole: authRepo.updateMembershipRole,
  deleteMembershipByUserAndWorkspace:
    authRepo.deleteMembershipByUserAndWorkspace,
  countMembershipsByRole: authRepo.countMembershipsByRole,
};

export type WorkspaceRole = MembershipRole;
