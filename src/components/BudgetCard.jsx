import { useEffect, useState } from "react";

function BudgetCard({
  selectedMonth,
  totalExpenses,
  onBudgetChange
}) {
  const [budget, setBudget] = useState("");

  const storageKey =
    selectedMonth === "all"
      ? "monthlyBudget-all"
      : `monthlyBudget-${selectedMonth}`;

  useEffect(() => {
    const savedBudget =
      localStorage.getItem(storageKey);

    setBudget(
      savedBudget || ""
    );
  }, [storageKey]);

  const numericBudget =
    Number(budget) || 0;

  const remaining =
    numericBudget - totalExpenses;

  const percentage =
    numericBudget > 0
      ? (totalExpenses / numericBudget) * 100
      : 0;

  const progressPercentage =
    Math.min(percentage, 100);

  let budgetStatus = "safe";
  let statusText = "You're within your budget";
  let statusIcon = "🟢";

  if (numericBudget === 0) {
    budgetStatus = "empty";
    statusText = "Set a budget to track your spending";
    statusIcon = "💡";
  } else if (percentage >= 100) {
    budgetStatus = "danger";
    statusText = "You have exceeded your budget";
    statusIcon = "🔴";
  } else if (percentage >= 80) {
    budgetStatus = "warning";
    statusText = "You're getting close to your budget";
    statusIcon = "🟡";
  }

  const handleBudgetChange = (event) => {
    const value = event.target.value;

    setBudget(value);

    if (value === "") {
      localStorage.removeItem(storageKey);

      onBudgetChange(0);

      return;
    }

    const numericValue =
      Number(value);

    if (numericValue >= 0) {
      localStorage.setItem(
        storageKey,
        numericValue
      );

      onBudgetChange(
        numericValue
      );
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    )}`;
  };

  return (
    <section className="budget-section">
      <div className="budget-header">
        <div>
          <h2>
            💰 Monthly Budget
          </h2>

          <p>
            Set a spending limit and track your progress
          </p>
        </div>

        <div className="budget-period">
          {selectedMonth === "all"
            ? "All Months"
            : selectedMonth}
        </div>
      </div>

      <div className="budget-content">
        <div className="budget-input-area">
          <label htmlFor="monthly-budget">
            Monthly Budget
          </label>

          <div className="budget-input-wrapper">
            <span>₹</span>

            <input
              id="monthly-budget"
              type="number"
              min="0"
              step="100"
              placeholder="Enter budget"
              value={budget}
              onChange={
                handleBudgetChange
              }
            />
          </div>

          <small>
            Example: ₹20,000
          </small>
        </div>

        <div className="budget-stat">
          <span>
            Budget
          </span>

          <strong>
            {formatCurrency(
              numericBudget
            )}
          </strong>
        </div>

        <div className="budget-stat">
          <span>
            Spent
          </span>

          <strong className="budget-spent">
            {formatCurrency(
              totalExpenses
            )}
          </strong>
        </div>

        <div className="budget-stat">
          <span>
            Remaining
          </span>

          <strong
            className={
              remaining >= 0
                ? "budget-remaining"
                : "budget-over"
            }
          >
            {remaining >= 0
              ? formatCurrency(
                  remaining
                )
              : `-${formatCurrency(
                  Math.abs(
                    remaining
                  )
                )}`}
          </strong>
        </div>
      </div>

      <div className="budget-progress-area">
        <div className="budget-progress-header">
          <span>
            Budget Usage
          </span>

          <strong>
            {percentage.toFixed(1)}%
          </strong>
        </div>

        <div className="budget-progress-bar">
          <div
            className={`budget-progress-fill ${budgetStatus}`}
            style={{
              width: `${progressPercentage}%`
            }}
          />
        </div>

        <div
          className={`budget-status ${budgetStatus}`}
        >
          <span>
            {statusIcon}
          </span>

          <span>
            {statusText}
          </span>
        </div>
      </div>
    </section>
  );
}

export default BudgetCard;