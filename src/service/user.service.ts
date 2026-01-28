import { User } from '../model/user.model';

export class UserService {
  static async getUsersByOrganization(organizationId: string) {
    return await User.find({ organizationId }).sort({ createdAt: -1 });
  }

  static async getUserById(id: string) {
    return await User.findById(id);
  }

  static async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }

  static async updateUser(id: string, updateData: any) {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  static async deleteUser(id: string) {
    return await User.findByIdAndDelete(id);
  }

  static async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  static async getUserStats(organizationId: string) {
    const users = await User.find({ organizationId });
    return {
      total: users.length,
      active: users.filter(u => u.status === 'Active').length,
      inactive: users.filter(u => u.status === 'Inactive').length,
      suspended: users.filter(u => u.status === 'Suspended').length,
      totalBalance: users.reduce((sum, u) => sum + (u.balance || 0), 0)
    };
  }
}