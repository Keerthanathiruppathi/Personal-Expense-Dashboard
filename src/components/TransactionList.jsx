import { useState } from "react";

function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction
}) {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const description = transaction.description || "";

    const matchesSearch = description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category === categoryFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory
    );
  });

  return (
    <div className="transaction-list">

      <h2>Transaction History</h2>

      {/* Search and Filters */}
      <div className="filters">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

      </div>

      {/* Transaction Table */}
      {filteredTransactions.length === 0 ? (

        <p className="no-transactions">
          No transactions found.
        </p>

      ) : (

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction) => (

              <tr key={transaction.id}>

                <td>{transaction.date}</td>

                <td>{transaction.description}</td>

                <td>{transaction.category}</td>

                <td>
                  {transaction.type === "income"
                    ? "Income"
                    : "Expense"}
                </td>

                <td>
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </td>

                <td>

                  <button
                    className="edit-button"
                    onClick={() =>
                      onEditTransaction(transaction)
                    }
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      onDeleteTransaction(transaction.id)
                    }
                  >
                    🗑️
                  </button>

                </td>

              </tr>

            ))}
          </tbody>

        </table>

      )}

    </div>
  );
}

export default TransactionList;