import { Transaction } from '../model/transaction.model';

export class TransactionService {
  static async getTransactionsByOrganization(organizationId: string, type?: 'income' | 'expense') {
    const filter: any = { organizationId };
    if (type) {
      filter.type = type;
    }
    return await Transaction.find(filter).sort({ createdAt: -1 });
  }

  static async createTransaction(data: any) {
    const transaction = new Transaction(data);
    return await transaction.save();
  }

  static async updateTransaction(id: string, data: any) {
    return await Transaction.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTransaction(id: string) {
    const result = await Transaction.findByIdAndDelete(id);
    return !!result;
  }

  static async getTransactionById(id: string) {
    return await Transaction.findById(id);
  }
}