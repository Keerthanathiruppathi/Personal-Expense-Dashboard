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

  return (
    <div className="app">

      <header className="header">
        <h1>Personal Expense Dashboard</h1>
        <p>Manage your finances in one place</p>
      </header>

      <section className="summary">

        <div className="card">
          <h3>Total Balance</h3>
          <p>₹25,500</p>
        </div>

        <div className="card">
          <h3>Total Income</h3>
          <p>₹40,000</p>
        </div>

        <div className="card">
          <h3>Total Expenses</h3>
          <p>₹14,500</p>
        </div>

        <div className="card">
          <h3>Transactions</h3>
          <p>{transactions.length}</p>
        </div>

      </section>

      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList transactions={transactions} />

    </div>
  );
}

export default App;