function App() {
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Personal Expense Dashboard</h1>
        <p>Manage your finances in one place</p>
      </header>

      {/* Summary Cards */}
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
          <p>24</p>
        </div>

      </section>

    </div>
  );
}

export default App;