import { useEffect, useMemo, useState } from "react";
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
  // Generate Available Months
  // =============================

  const availableMonths = useMemo(() => {
    const months = transactions
      .map((transaction) => transaction.date?.slice(0, 7))
      .filter(Boolean);

    return [...new Set(months)].sort().reverse();
  }, [transactions]);

  // =============================
  // Format Month Name
  // =============================

  const formatMonth = (monthValue) => {
    const [year, month] = monthValue.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1
    );

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    });
  };

  // =============================
  // Filter Transactions
  // =============================

  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((transaction) =>
          transaction.date?.startsWith(selectedMonth)
        );

  // =============================
  // Total Income
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
  // Total Expenses
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
  // Balance
  // =============================

  const balance = totalIncome - totalExpenses;

  // =============================
  // Advanced Analytics
  // =============================

  const expenseTransactions =
    filteredTransactions.filter(
      (transaction) =>
        transaction.type === "expense"
    );

  const incomeTransactions =
    filteredTransactions.filter(
      (transaction) =>
        transaction.type === "income"
    );

  // =============================
  // Average Expense
  // =============================

  const averageExpense =
    expenseTransactions.length > 0
      ? totalExpenses /
        expenseTransactions.length
      : 0;

  // =============================
  // Highest Expense
  // =============================

  const highestExpense =
    expenseTransactions.length > 0
      ? Math.max(
          ...expenseTransactions.map(
            (transaction) =>
              Number(transaction.amount)
          )
        )
      : 0;

  // =============================
  // Category Totals
  // =============================

  const categoryTotals = {};

  expenseTransactions.forEach(
    (transaction) => {
      const category =
        transaction.category || "Other";

      if (categoryTotals[category]) {
        categoryTotals[category] +=
          Number(transaction.amount);
      } else {
        categoryTotals[category] =
          Number(transaction.amount);
      }
    }
  );

  // =============================
  // Top Spending Category
  // =============================

  let topCategory = "No data";
  let topCategoryAmount = 0;

  Object.entries(categoryTotals).forEach(
    ([category, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = category;
        topCategoryAmount = amount;
      }
    }
  );

  // =============================
  // Savings Rate
  // =============================

  const savingsRate =
    totalIncome > 0
      ? (balance / totalIncome) * 100
      : 0;

  // =============================
  // Smart Insights
  // =============================

  const smartInsights = [];

  // No transactions

  if (filteredTransactions.length === 0) {
    smartInsights.push({
      type: "info",
      icon: "📊",
      title: "No Data Yet",
      message:
        "Add some income or expense transactions to receive personalized financial insights."
    });
  }

  // No expenses

  if (
    filteredTransactions.length > 0 &&
    totalExpenses === 0
  ) {
    smartInsights.push({
      type: "success",
      icon: "🎉",
      title: "No Expenses Yet",
      message:
        "You haven't recorded any expenses for this period."
    });
  }

  // Expenses greater than income

  if (
    totalExpenses > totalIncome &&
    totalExpenses > 0
  ) {
    smartInsights.push({
      type: "warning",
      icon: "⚠️",
      title: "High Spending Alert",
      message:
        "Your expenses are higher than your income for this period. Consider reducing unnecessary spending."
    });
  }

  // Expenses equal to income

  if (
    totalIncome > 0 &&
    totalExpenses === totalIncome
  ) {
    smartInsights.push({
      type: "warning",
      icon: "⚖️",
      title: "Break-Even Budget",
      message:
        "Your income and expenses are equal. You currently have no money left for savings."
    });
  }

  // Good savings

  if (
    totalIncome > 0 &&
    savingsRate >= 20
  ) {
    smartInsights.push({
      type: "success",
      icon: "💚",
      title: "Great Job!",
      message:
        `You are saving ${savingsRate.toFixed(
          1
        )}% of your income. Keep maintaining this healthy saving habit.`
    });
  }

  // Small savings

  if (
    totalIncome > 0 &&
    savingsRate > 0 &&
    savingsRate < 20
  ) {
    smartInsights.push({
      type: "info",
      icon: "💡",
      title: "Savings Opportunity",
      message:
        `You are currently saving ${savingsRate.toFixed(
          1
        )}% of your income. Try reducing unnecessary expenses to increase your savings.`
    });
  }

  // Top spending category

  if (
    topCategory !== "No data" &&
    topCategoryAmount > 0
  ) {
    smartInsights.push({
      type: "category",
      icon: "💡",
      title: "Top Spending Area",
      message:
        `${topCategory} is currently your highest spending category with ₹${topCategoryAmount.toLocaleString(
          "en-IN"
        )} spent.`
    });
  }

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

          {availableMonths.map((month) => (
            <option
              key={month}
              value={month}
            >
              {formatMonth(month)}
            </option>
          ))}

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
      {/* Financial Analytics */}
      {/* ========================= */}

      <section className="analytics-section">

        <div className="analytics-header">

          <h2>
            📊 Financial Analytics
          </h2>

          <p>
            Get insights into your spending habits
          </p>

        </div>


        <div className="analytics-grid">

          {/* Average Expense */}

          <div className="analytics-card">

            <div className="analytics-icon">
              💵
            </div>

            <div>

              <h3>
                Average Expense
              </h3>

              <p>
                ₹
                {averageExpense.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2
                  }
                )}
              </p>

              <span>
                Per expense transaction
              </span>

            </div>

          </div>


          {/* Highest Expense */}

          <div className="analytics-card">

            <div className="analytics-icon">
              🔥
            </div>

            <div>

              <h3>
                Highest Expense
              </h3>

              <p>
                ₹
                {highestExpense.toLocaleString(
                  "en-IN"
                )}
              </p>

              <span>
                Largest single expense
              </span>

            </div>

          </div>


          {/* Top Category */}

          <div className="analytics-card">

            <div className="analytics-icon">
              🏆
            </div>

            <div>

              <h3>
                Top Category
              </h3>

              <p>
                {topCategory}
              </p>

              <span>
                ₹
                {topCategoryAmount.toLocaleString(
                  "en-IN"
                )}{" "}
                spent
              </span>

            </div>

          </div>


          {/* Savings Rate */}

          <div className="analytics-card">

            <div className="analytics-icon">
              💚
            </div>

            <div>

              <h3>
                Savings Rate
              </h3>

              <p>
                {savingsRate.toFixed(1)}%
              </p>

              <span>
                Income remaining
              </span>

            </div>

          </div>


          {/* Income Transactions */}

          <div className="analytics-card">

            <div className="analytics-icon">
              📈
            </div>

            <div>

              <h3>
                Income Transactions
              </h3>

              <p>
                {incomeTransactions.length}
              </p>

              <span>
                Money received records
              </span>

            </div>

          </div>


          {/* Expense Transactions */}

          <div className="analytics-card">

            <div className="analytics-icon">
              📉
            </div>

            <div>

              <h3>
                Expense Transactions
              </h3>

              <p>
                {expenseTransactions.length}
              </p>

              <span>
                Money spent records
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* Smart Spending Insights */}
      {/* ========================= */}

      <section className="insights-section">

        <div className="insights-header">

          <h2>
            🧠 Smart Spending Insights
          </h2>

          <p>
            Personalized insights based on your financial activity
          </p>

        </div>


        <div className="insights-grid">

          {smartInsights.map(
            (insight, index) => (
              <div
                className={`insight-card ${insight.type}`}
                key={index}
              >

                <div className="insight-icon">
                  {insight.icon}
                </div>

                <div className="insight-content">

                  <h3>
                    {insight.title}
                  </h3>

                  <p>
                    {insight.message}
                  </p>

                </div>

              </div>
            )
          )}

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
      {/* Transaction History */}
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