import { Budget } from '../model/budget.model';

export class BudgetService {
  static async getBudgetsByOrganization(organizationId: string) {
    return await Budget.find({ organizationId }).sort({ createdAt: -1 });
  }

  static async createBudget(data: any) {
    const budget = new Budget(data);
    return await budget.save();
  }

  static async updateBudget(id: string, data: any) {
    return await Budget.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteBudget(id: string) {
    const result = await Budget.findByIdAndDelete(id);
    return !!result;
  }

  static async getBudgetById(id: string) {
    return await Budget.findById(id);
  }
}