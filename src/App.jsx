import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {

  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      transaction
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
    )
  );
};

  const totalIncome = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="app">

      <header className="header">
        <h1>Personal Expense Dashboard</h1>
        <p>Manage your finances in one place</p>
      </header>

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
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList
  transactions={transactions}
  onDeleteTransaction={deleteTransaction}
/>

    </div>
  );
}

export default App;