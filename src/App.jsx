import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Charts from "./components/Charts";

function App() {
  // =============================
  // Transactions
  // =============================

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("transactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  // =============================
  // Editing Transaction
  // =============================

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  // =============================
  // Selected Month
  // =============================

  const [selectedMonth, setSelectedMonth] =
    useState("all");

  // =============================
  // Save Transactions
  // =============================

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // =============================
  // Add Transaction
  // =============================

  const addTransaction = (transaction) => {
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      transaction
    ]);
  };

  // =============================
  // Delete Transaction
  // =============================

  const deleteTransaction = (id) => {
    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  // =============================
  // Edit Transaction
  // =============================

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  // =============================
  // Update Transaction
  // =============================

  const updateTransaction = (updatedTransaction) => {
    setTransactions((previousTransactions) =>
      previousTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  // =============================
  // Filter Transactions by Month
  // =============================

  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((transaction) =>
          transaction.date.startsWith(selectedMonth)
        );

  // =============================
  // Calculate Total Income
  // =============================

  const totalIncome = filteredTransactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // =============================
  // Calculate Total Expenses
  // =============================

  const totalExpenses = filteredTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // =============================
  // Calculate Balance
  // =============================

  const balance = totalIncome - totalExpenses;

  // =============================
  // UI
  // =============================

  return (
    <div className="app">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <header className="header">

        <h1>
          Personal Expense Dashboard
        </h1>

        <p>
          Manage your finances in one place
        </p>

      </header>


      {/* ========================= */}
      {/* Month Filter */}
      {/* ========================= */}

      <div className="month-filter">

        <label htmlFor="month">
          📅 Select Month
        </label>

        <select
          id="month"
          value={selectedMonth}
          onChange={(event) =>
            setSelectedMonth(event.target.value)
          }
        >

          <option value="all">
            All Months
          </option>

          <option value="2026-01">
            January 2026
          </option>

          <option value="2026-02">
            February 2026
          </option>

          <option value="2026-03">
            March 2026
          </option>

          <option value="2026-04">
            April 2026
          </option>

          <option value="2026-05">
            May 2026
          </option>

          <option value="2026-06">
            June 2026
          </option>

          <option value="2026-07">
            July 2026
          </option>

          <option value="2026-08">
            August 2026
          </option>

          <option value="2026-09">
            September 2026
          </option>

          <option value="2026-10">
            October 2026
          </option>

          <option value="2026-11">
            November 2026
          </option>

          <option value="2026-12">
            December 2026
          </option>

        </select>

      </div>


      {/* ========================= */}
      {/* Summary Cards */}
      {/* ========================= */}

      <section className="summary">

        {/* Balance */}

        <div className="card balance-card">

          <div className="card-icon">
            💰
          </div>

          <div className="card-content">

            <h3>
              Total Balance
            </h3>

            <p
              className={
                balance >= 0
                  ? "positive"
                  : "negative"
              }
            >
              ₹{balance.toLocaleString("en-IN")}
            </p>

            <span>
              {balance >= 0
                ? "Your balance is positive"
                : "Your expenses are higher than income"}
            </span>

          </div>

        </div>


        {/* Income */}

        <div className="card income-card">

          <div className="card-icon">
            📈
          </div>

          <div className="card-content">

            <h3>
              Total Income
            </h3>

            <p className="positive">
              ₹{totalIncome.toLocaleString("en-IN")}
            </p>

            <span>
              Money received
            </span>

          </div>

        </div>


        {/* Expenses */}

        <div className="card expense-card">

          <div className="card-icon">
            📉
          </div>

          <div className="card-content">

            <h3>
              Total Expenses
            </h3>

            <p className="negative">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </p>

            <span>
              Money spent
            </span>

          </div>

        </div>


        {/* Transactions */}

        <div className="card transaction-card">

          <div className="card-icon">
            🧾
          </div>

          <div className="card-content">

            <h3>
              Transactions
            </h3>

            <p>
              {filteredTransactions.length}
            </p>

            <span>
              Total records
            </span>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* Transaction Form */}
      {/* ========================= */}

      <TransactionForm
        onAddTransaction={addTransaction}
        editingTransaction={editingTransaction}
        onUpdateTransaction={updateTransaction}
      />


      {/* ========================= */}
      {/* Transaction List */}
      {/* ========================= */}

      <TransactionList
        transactions={filteredTransactions}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={editTransaction}
      />


      {/* ========================= */}
      {/* Charts */}
      {/* ========================= */}

      <Charts
        transactions={filteredTransactions}
      />

    </div>
  );
}

export default App;