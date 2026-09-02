import { useEffect, useState } from "react";

function TransactionForm({
  onAddTransaction,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit
}) {
  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [type, setType] =
    useState("expense");

  const [category, setCategory] =
    useState("Food");

  const [date, setDate] =
    useState("");

  useEffect(() => {
    if (editingTransaction) {
      setDescription(
        editingTransaction.description || ""
      );

      setAmount(
        editingTransaction.amount || ""
      );

      setType(
        editingTransaction.type || "expense"
      );

      setCategory(
        editingTransaction.category || "Food"
      );

      setDate(
        editingTransaction.date || ""
      );
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !description.trim() ||
      !amount ||
      !date
    ) {
      window.dispatchEvent(
        new CustomEvent(
          "expense-dashboard-toast",
          {
            detail: {
              type: "warning",
              icon: "⚠️",
              title: "Incomplete Form",
              message:
                "Please fill in all required fields."
            }
          }
        )
      );

      return;
    }

    if (Number(amount) <= 0) {
      window.dispatchEvent(
        new CustomEvent(
          "expense-dashboard-toast",
          {
            detail: {
              type: "warning",
              icon: "⚠️",
              title: "Invalid Amount",
              message:
                "Please enter an amount greater than zero."
            }
          }
        )
      );

      return;
    }

    const transaction = {
      id:
        editingTransaction?.id ||
        Date.now(),

      description:
        description.trim(),

      amount:
        Number(amount),

      type,

      category,

      date
    };

    if (editingTransaction) {
      onUpdateTransaction(
        transaction
      );
    } else {
      onAddTransaction(
        transaction
      );
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <section className="form-section">
      <div className="form-header">
        <h2>
          {editingTransaction
            ? "✏️ Edit Transaction"
            : "➕ Add Transaction"}
        </h2>

        <p>
          {editingTransaction
            ? "Update your transaction details"
            : "Record your income or expenses"}
        </p>
      </div>

      <form
        className="transaction-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>
            Description
          </label>

          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value
              )
            }
          >
            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >
            <option value="Food">
              Food
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Salary">
              Salary
            </option>

            <option value="Freelance">
              Freelance
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          />
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="submit-button"
          >
            {editingTransaction
              ? "💾 Update Transaction"
              : "➕ Add Transaction"}
          </button>

          {editingTransaction && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;