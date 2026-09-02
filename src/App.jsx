import { useEffect, useMemo, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Charts from "./components/Charts";
import Toast from "./components/Toast";
import BudgetCard from "./components/BudgetCard";
import { exportToCSV } from "./utils/exportCSV";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("transactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [selectedMonth, setSelectedMonth] =
    useState("all");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("darkMode");

    return savedTheme === "true";
  });

  const [toast, setToast] = useState(null);

  const [monthlyBudget, setMonthlyBudget] =
    useState(0);

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      darkMode
    );

    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );
  }, [darkMode]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    const storageKey =
      selectedMonth === "all"
        ? "monthlyBudget-all"
        : `monthlyBudget-${selectedMonth}`;

    const savedBudget =
      localStorage.getItem(
        storageKey
      );

    setMonthlyBudget(
      savedBudget
        ? Number(savedBudget)
        : 0
    );
  }, [selectedMonth]);

  useEffect(() => {
    const handleToastEvent = (event) => {
      setToast(event.detail);
    };

    window.addEventListener(
      "expense-dashboard-toast",
      handleToastEvent
    );

    return () => {
      window.removeEventListener(
        "expense-dashboard-toast",
        handleToastEvent
      );
    };
  }, []);

  const showToast = (
    type,
    icon,
    title,
    message
  ) => {
    setToast({
      type,
      icon,
      title,
      message
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  const addTransaction = (transaction) => {
    setTransactions(
      (previousTransactions) => [
        ...previousTransactions,
        transaction
      ]
    );

    showToast(
      "success",
      "✅",
      "Transaction Added",
      "Your transaction was added successfully."
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(
      (previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            transaction.id !== id
        )
    );

    showToast(
      "danger",
      "🗑️",
      "Transaction Deleted",
      "The transaction was deleted successfully."
    );
  };

  const editTransaction = (
    transaction
  ) => {
    setEditingTransaction(
      transaction
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const updateTransaction = (
    updatedTransaction
  ) => {
    setTransactions(
      (previousTransactions) =>
        previousTransactions.map(
          (transaction) =>
            transaction.id ===
            updatedTransaction.id
              ? updatedTransaction
              : transaction
        )
    );

    setEditingTransaction(
      null
    );

    showToast(
      "info",
      "✏️",
      "Transaction Updated",
      "Your transaction was updated successfully."
    );
  };

  const cancelEdit = () => {
    setEditingTransaction(
      null
    );

    showToast(
      "info",
      "↩️",
      "Edit Cancelled",
      "No changes were made to the transaction."
    );
  };

  const availableMonths = useMemo(() => {
    const months =
      transactions
        .map(
          (transaction) =>
            transaction.date?.slice(
              0,
              7
            )
        )
        .filter(Boolean);

    return [
      ...new Set(months)
    ].sort().reverse();
  }, [transactions]);

  const formatMonth = (
    monthValue
  ) => {
    const [
      year,
      month
    ] =
      monthValue.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );
  };

  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.date?.startsWith(
              selectedMonth
            )
        );

  const totalIncome =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      );

  const totalExpenses =
    filteredTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      );

  const balance =
    totalIncome -
    totalExpenses;

  const expenseTransactions =
    filteredTransactions.filter(
      (transaction) =>
        transaction.type ===
        "expense"
    );

  const incomeTransactions =
    filteredTransactions.filter(
      (transaction) =>
        transaction.type ===
        "income"
    );

  const averageExpense =
    expenseTransactions.length >
    0
      ? totalExpenses /
        expenseTransactions.length
      : 0;

  const highestExpense =
    expenseTransactions.length >
    0
      ? Math.max(
          ...expenseTransactions.map(
            (transaction) =>
              Number(
                transaction.amount
              )
          )
        )
      : 0;

  const categoryTotals = {};

  expenseTransactions.forEach(
    (transaction) => {
      const category =
        transaction.category ||
        "Other";

      categoryTotals[
        category
      ] =
        (categoryTotals[
          category
        ] || 0) +
        Number(
          transaction.amount
        );
    }
  );

  let topCategory =
    "No data";

  let topCategoryAmount = 0;

  Object.entries(
    categoryTotals
  ).forEach(
    ([category, amount]) => {
      if (
        amount >
        topCategoryAmount
      ) {
        topCategory =
          category;

        topCategoryAmount =
          amount;
      }
    }
  );

  const savingsRate =
    totalIncome > 0
      ? (balance /
          totalIncome) *
        100
      : 0;

  const budgetRemaining =
    monthlyBudget -
    totalExpenses;

  const budgetPercentage =
    monthlyBudget > 0
      ? (totalExpenses /
          monthlyBudget) *
        100
      : 0;

  const smartInsights = [];

  if (
    filteredTransactions.length ===
    0
  ) {
    smartInsights.push({
      type: "info",
      icon: "📊",
      title: "No Data Yet",
      message:
        "Add some income or expense transactions to receive personalized financial insights."
    });
  }

  if (
    filteredTransactions.length >
      0 &&
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

  if (
    totalExpenses >
      totalIncome &&
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

  if (
    totalIncome > 0 &&
    totalExpenses ===
      totalIncome
  ) {
    smartInsights.push({
      type: "warning",
      icon: "⚖️",
      title: "Break-Even Budget",
      message:
        "Your income and expenses are equal. You currently have no money left for savings."
    });
  }

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

  if (
    topCategory !==
      "No data" &&
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

  if (
    monthlyBudget > 0 &&
    budgetPercentage >= 100
  ) {
    smartInsights.push({
      type: "warning",
      icon: "🚨",
      title: "Budget Exceeded",
      message:
        `You have exceeded your budget by ₹${Math.abs(
          budgetRemaining
        ).toLocaleString(
          "en-IN"
        )}.`
    });
  }

  if (
    monthlyBudget > 0 &&
    budgetPercentage >= 80 &&
    budgetPercentage < 100
  ) {
    smartInsights.push({
      type: "info",
      icon: "⚠️",
      title: "Budget Almost Reached",
      message:
        `You have used ${budgetPercentage.toFixed(
          1
        )}% of your budget.`
    });
  }

  const handleBudgetChange = (
    value
  ) => {
    setMonthlyBudget(
      Number(value) || 0
    );

    if (Number(value) > 0) {
      showToast(
        "success",
        "💰",
        "Budget Updated",
        "Your monthly budget has been saved."
      );
    }
  };

  const handleExportCSV = () => {
    const exported =
      exportToCSV(
        filteredTransactions,
        selectedMonth
      );

    if (exported) {
      showToast(
        "success",
        "📥",
        "CSV Exported",
        "Your transaction data was exported successfully."
      );
    } else {
      showToast(
        "warning",
        "⚠️",
        "Nothing to Export",
        "There are no transactions available for export."
      );
    }
  };

  return (
    <div
      className={`app ${
        darkMode
          ? "dark-theme"
          : ""
      }`}
    >
      <Toast
        toast={toast}
        onClose={
          closeToast
        }
      />

      <header className="header">
        <div>
          <h1>
            Personal Expense Dashboard
          </h1>

          <p>
            Manage your finances in one place
          </p>
        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(
              (previousMode) =>
                !previousMode
            )
          }
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="month-filter">
        <div>
          <label htmlFor="month">
            📅 Select Month
          </label>

          <select
            id="month"
            value={
              selectedMonth
            }
            onChange={(
              event
            ) =>
              setSelectedMonth(
                event.target.value
              )
            }
          >
            <option value="all">
              All Months
            </option>

            {availableMonths.map(
              (month) => (
                <option
                  key={month}
                  value={month}
                >
                  {formatMonth(
                    month
                  )}
                </option>
              )
            )}
          </select>
        </div>

        <button
          className="export-button"
          onClick={
            handleExportCSV
          }
        >
          📥 Export CSV
        </button>
      </div>

      <section className="summary">
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
              ₹
              {balance.toLocaleString(
                "en-IN"
              )}
            </p>

            <span>
              {balance >= 0
                ? "Your balance is positive"
                : "Your expenses are higher than income"}
            </span>
          </div>
        </div>

        <div className="card income-card">
          <div className="card-icon">
            📈
          </div>

          <div className="card-content">
            <h3>
              Total Income
            </h3>

            <p className="positive">
              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}
            </p>

            <span>
              Money received
            </span>
          </div>
        </div>

        <div className="card expense-card">
          <div className="card-icon">
            📉
          </div>

          <div className="card-content">
            <h3>
              Total Expenses
            </h3>

            <p className="negative">
              ₹
              {totalExpenses.toLocaleString(
                "en-IN"
              )}
            </p>

            <span>
              Money spent
            </span>
          </div>
        </div>

        <div className="card transaction-card">
          <div className="card-icon">
            🧾
          </div>

          <div className="card-content">
            <h3>
              Transactions
            </h3>

            <p>
              {
                filteredTransactions.length
              }
            </p>

            <span>
              Total records
            </span>
          </div>
        </div>
      </section>

      <BudgetCard
        selectedMonth={
          selectedMonth
        }
        totalExpenses={
          totalExpenses
        }
        onBudgetChange={
          handleBudgetChange
        }
      />

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

          <div className="analytics-card">
            <div className="analytics-icon">
              💚
            </div>

            <div>
              <h3>
                Savings Rate
              </h3>

              <p>
                {savingsRate.toFixed(
                  1
                )}
                %
              </p>

              <span>
                Income remaining
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">
              📈
            </div>

            <div>
              <h3>
                Income Transactions
              </h3>

              <p>
                {
                  incomeTransactions.length
                }
              </p>

              <span>
                Money received records
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">
              📉
            </div>

            <div>
              <h3>
                Expense Transactions
              </h3>

              <p>
                {
                  expenseTransactions.length
                }
              </p>

              <span>
                Money spent records
              </span>
            </div>
          </div>
        </div>
      </section>

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
            (
              insight,
              index
            ) => (
              <div
                className={`insight-card ${insight.type}`}
                key={index}
              >
                <div className="insight-icon">
                  {
                    insight.icon
                  }
                </div>

                <div className="insight-content">
                  <h3>
                    {
                      insight.title
                    }
                  </h3>

                  <p>
                    {
                      insight.message
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <TransactionForm
        onAddTransaction={
          addTransaction
        }
        editingTransaction={
          editingTransaction
        }
        onUpdateTransaction={
          updateTransaction
        }
        onCancelEdit={
          cancelEdit
        }
      />

      <TransactionList
        transactions={
          filteredTransactions
        }
        onDeleteTransaction={
          deleteTransaction
        }
        onEditTransaction={
          editTransaction
        }
      />

      <Charts
        transactions={
          filteredTransactions
        }
      />
    </div>
  );
}

export default App;