import { useState } from "react";

function TransactionForm({ onAddTransaction }) {

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event) => {
  event.preventDefault();

  const newTransaction = {
    id: Date.now(),
    type,
    amount: Number(amount),
    category,
    description,
    date
  };

  onAddTransaction(newTransaction);

  setAmount("");
  setDescription("");
  setDate("");
};

  return (
    <div className="transaction-form">

      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>

        {/* Transaction Type */}
        <label>Type</label>

        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>


        {/* Amount */}
        <label>Amount</label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />


        {/* Category */}
        <label>Category</label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>


        {/* Description */}
        <label>Description</label>

        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />


        {/* Date */}
        <label>Date</label>

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />


        <button type="submit">
          Add Transaction
        </button>

      </form>

    </div>
  );
}

export default TransactionForm;