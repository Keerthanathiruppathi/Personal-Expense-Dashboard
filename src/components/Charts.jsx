import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

function Charts({ transactions }) {

  // -----------------------------
  // Income and Expense totals
  // -----------------------------

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const incomeExpenseData = [
    {
      name: "Finance",
      Income: income,
      Expenses: expenses
    }
  ];


  // -----------------------------
  // Expense by Category
  // -----------------------------

  const categoryTotals = {};

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {

      const category = transaction.category;
      const amount = Number(transaction.amount);

      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category,
      value: amount
    })
  );


  // -----------------------------
  // Expense Trend
  // -----------------------------

  const expenseByDate = {};

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {

      const date = transaction.date;
      const amount = Number(transaction.amount);

      if (expenseByDate[date]) {
        expenseByDate[date] += amount;
      } else {
        expenseByDate[date] = amount;
      }
    });

  const expenseTrendData = Object.entries(expenseByDate)
    .sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    )
    .map(([date, amount]) => ({
      date,
      expenses: amount
    }));


  // -----------------------------
  // Pie Chart Colors
  // -----------------------------

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28"
  ];


  return (
    <div className="charts-section">

      {/* ========================= */}
      {/* Income vs Expenses */}
      {/* ========================= */}

      <div className="chart-card">

        <h2>Income vs Expenses</h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={incomeExpenseData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Income"
              fill="#22c55e"
            />

            <Bar
              dataKey="Expenses"
              fill="#ef4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* ========================= */}
      {/* Expenses by Category */}
      {/* ========================= */}

      <div className="chart-card">

        <h2>Expenses by Category</h2>

        {categoryData.length === 0 ? (

          <p className="no-chart-data">
            No expense data available.
          </p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >

                {categoryData.map(
                  (entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        )}

      </div>


      {/* ========================= */}
      {/* Expense Trend */}
      {/* ========================= */}

      <div className="chart-card expense-trend-card">

        <h2>Expense Trend</h2>

        {expenseTrendData.length === 0 ? (

          <p className="no-chart-data">
            No expense data available.
          </p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={expenseTrendData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                name="Expenses"
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default Charts;