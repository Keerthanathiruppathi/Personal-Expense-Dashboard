function TransactionList({ transactions }) {

  return (
    <div className="transaction-list">

      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            {transactions.map((transaction) => (
              <tr key={transaction.id}>

                <td>{transaction.date}</td>

                <td>{transaction.description}</td>

                <td>{transaction.category}</td>

                <td>{transaction.type}</td>

                <td>
                  ₹{transaction.amount}
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