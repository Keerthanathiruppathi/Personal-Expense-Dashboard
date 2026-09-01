import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function Charts({ transactions }) {

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const data = [
    {
      name: "Finance",
      Income: income,
      Expenses: expenses
    }
  ];

  return (
    <div className="charts-section">

      <div className="chart-card">

        <h2>Income vs Expenses</h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={data}>

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

    </div>
  );
}

export default Charts;