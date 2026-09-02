import { useState } from "react";

function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterType, setFilterType] =
    useState("all");

  // =============================
  // Filter Transactions
  // =============================

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const matchesSearch =
          transaction.description
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          transaction.category
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesType =
          filterType === "all" ||
          transaction.type ===
            filterType;

        return (
          matchesSearch &&
          matchesType
        );
      }
    );

  // =============================
  // Format Date
  // =============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =============================
  // UI
  // =============================

  return (
    <section className="transactions-section">

      <div className="transactions-header">

        <div>

          <h2>
            🧾 Transaction History
          </h2>

          <p>
            View and manage your transactions
          </p>

        </div>

        <span className="transaction-count">
          {filteredTransactions.length} records
        </span>

      </div>


      {/* Search + Filter */}

      <div className="transaction-controls">

        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
        />

        <select
          value={filterType}
          onChange={(event) =>
            setFilterType(
              event.target.value
            )
          }
        >

          <option value="all">
            All Types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>

        </select>

      </div>


      {/* Empty State */}

      {filteredTransactions.length === 0 ? (

        <div className="empty-state">

          <div>
            📭
          </div>

          <h3>
            No transactions found
          </h3>

          <p>
            Try changing your search or
            add a new transaction.
          </p>

        </div>

      ) : (

        <div className="transaction-table-wrapper">

          <table className="transaction-table">

            <thead>

              <tr>

                <th>
                  Date
                </th>

                <th>
                  Description
                </th>

                <th>
                  Category
                </th>

                <th>
                  Type
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map(
                (transaction) => (

                  <tr
                    key={
                      transaction.id
                    }
                  >

                    <td>
                      {formatDate(
                        transaction.date
                      )}
                    </td>

                    <td>
                      <strong>
                        {
                          transaction.description
                        }
                      </strong>
                    </td>

                    <td>
                      <span className="category-badge">
                        {
                          transaction.category ||
                          "Other"
                        }
                      </span>
                    </td>

                    <td>

                      <span
                        className={`type-badge ${
                          transaction.type
                        }`}
                      >
                        {transaction.type ===
                        "income"
                          ? "↑ Income"
                          : "↓ Expense"}
                      </span>

                    </td>

                    <td
                      className={
                        transaction.type ===
                        "income"
                          ? "amount-income"
                          : "amount-expense"
                      }
                    >
                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}
                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            onEditTransaction(
                              transaction
                            )
                          }
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => {
                            const confirmed =
                              window.confirm(
                                "Are you sure you want to delete this transaction?"
                              );

                            if (
                              confirmed
                            ) {
                              onDeleteTransaction(
                                transaction.id
                              );
                            }
                          }}
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default TransactionList;