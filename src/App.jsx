import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Charts from "./components/Charts";

function App() {

  // Store all transactions
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  // Store the transaction currently being edited
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Save transactions to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // Add a new transaction
  const addTransaction = (transaction) => {
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      transaction
    ]);
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  // Select a transaction for editing
  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  // Update an existing transaction
  const updateTransaction = (updatedTransaction) => {
    setTransactions((previousTransactions) =>
      previousTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    // Exit edit mode
    setEditingTransaction(null);
  };

  // Calculate total income
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  // Calculate balance
  const balance = totalIncome - totalExpenses;

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Personal Expense Dashboard</h1>
        <p>Manage your finances in one place</p>
      </header>

      {/* Summary Cards */}
      <section className="summary">

        <div className="card">
          <h3>Total Balance</h3>
          <p>₹{balance.toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Total Income</h3>
          <p>₹{totalIncome.toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses.toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Transactions</h3>
          <p>{transactions.length}</p>
        </div>

      </section>

      {/* Transaction Form */}
      <TransactionForm
        onAddTransaction={addTransaction}
        editingTransaction={editingTransaction}
        onUpdateTransaction={updateTransaction}
      />

      {/* Transaction History */}
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={editTransaction}
      />

      <Charts transactions={transactions} />

    </div>
  );
}

export default App;