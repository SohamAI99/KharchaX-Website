// utils/expenseLogic.ts

export interface UserNode {
  _id: string;
  name: string;
}

export interface SplitAmount {
  user: UserNode;
  amountOwed: number;
}

export interface APIExpense {
  _id: string;
  paidBy: UserNode;
  amount: number;
  splitAmong: SplitAmount[];
}

export interface SettlementInstruction {
  fromUser: UserNode;
  toUser: UserNode;
  amount: number;
}

export interface UserBalanceDashboard {
  youOweTotal: number;
  youGetTotal: number;
  oweList: { name: string; amount: number }[];
  getList: { name: string; amount: number }[];
}

/**
 * Core Algorithm to Minimize Debts
 * Takes a list of raw expenses and outputs exactly who owes what to whom seamlessly.
 */
export function calculateSettlements(expenses: APIExpense[], users: UserNode[]): SettlementInstruction[] {
  // 1. Calculate pure net balances for every user
  const balances: Record<string, number> = {};
  const userMap: Record<string, UserNode> = {};

  users.forEach(u => {
    balances[u._id] = 0;
    userMap[u._id] = u;
  });

  expenses.forEach((expense) => {
    // The person who paid gets the total amount credited to their positive balance
    if (balances[expense.paidBy._id] !== undefined) {
       balances[expense.paidBy._id] += expense.amount;
    }

    // Everyone who is a part of the split owes their individual share
    expense.splitAmong.forEach((split) => {
      if (balances[split.user._id] !== undefined) {
         balances[split.user._id] -= split.amountOwed;
      }
    });
  });

  // 2. Separate into Debtors (negative balance) and Creditors (positive balance)
  const debtors = Object.keys(balances)
    .filter(id => balances[id] < -0.01) // using 0.01 to avoid JS float precision issues
    .map(id => ({ id, balance: balances[id] }))
    .sort((a, b) => a.balance - b.balance); // Most in debt first

  const creditors = Object.keys(balances)
    .filter(id => balances[id] > 0.01)
    .map(id => ({ id, balance: balances[id] }))
    .sort((a, b) => b.balance - a.balance); // Most owed first

  const settlements: SettlementInstruction[] = [];
  
  let i = 0; // debtors index
  let j = 0; // creditors index

  // 3. Match Debtors to Creditors to minimize total transactions
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    // The amount to settle between these two is the minimum of what debtor owes and creditor is owed
    const settleAmount = Math.min(Math.abs(debtor.balance), creditor.balance);
    
    settlements.push({
      fromUser: userMap[debtor.id],
      toUser: userMap[creditor.id],
      amount: Math.round(settleAmount * 100) / 100, // Round to 2 decimals
    });

    // Update the temporary balances
    debtor.balance += settleAmount;
    creditor.balance -= settleAmount;

    // Move pointers if a balance reaches 0
    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j++;
  }

  return settlements;
}

/**
 * Filter the global settlements to isolate exactly what a specific user needs to see on their Dashboard.
 */
export function getUserDashboardBalances(
  userId: string, 
  settlements: SettlementInstruction[]
): UserBalanceDashboard {
  
  let youOweTotal = 0;
  let youGetTotal = 0;
  const oweList: { name: string; amount: number }[] = [];
  const getList: { name: string; amount: number }[] = [];

  settlements.forEach(settlement => {
    if (settlement.fromUser._id === userId) {
      // User owes someone
      youOweTotal += settlement.amount;
      oweList.push({ name: settlement.toUser.name, amount: settlement.amount });
    } else if (settlement.toUser._id === userId) {
      // Someone owes user
      youGetTotal += settlement.amount;
      getList.push({ name: settlement.fromUser.name, amount: settlement.amount });
    }
  });

  return {
    youOweTotal,
    youGetTotal,
    oweList,
    getList
  };
}
