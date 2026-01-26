import { Role } from "@/src/model/role.model";
import dbConnect from "@/src/lib/db";

export class RoleService {
  static async getAllRoles(orgId: string) {
    await dbConnect();
    return await Role.find({ orgId }).sort({ createdAt: -1 });
  }

  static async getRoleById(id: string) {
    await dbConnect();
    return await Role.findById(id);
  }

  static async createRole(data: any) {
    await dbConnect();
    return await Role.create(data);
  }

  static async updateRole(id: string, data: any) {
    await dbConnect();
    return await Role.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteRole(id: string) {
    await dbConnect();
    return await Role.findByIdAndDelete(id);
  }

  static async getRoleStats(orgId: string) {
    await dbConnect();
    const roles = await Role.find({ orgId });
    return {
      total: roles.length,
      admin: roles.filter(r => r.level === 'Admin').length,
      manager: roles.filter(r => r.level === 'Manager').length,
      user: roles.filter(r => r.level === 'User').length,
      viewer: roles.filter(r => r.level === 'Viewer').length
    };
  }
}