export const exportToCSV = (
  transactions,
  selectedMonth
) => {
  if (
    !transactions ||
    transactions.length === 0
  ) {
    return false;
  }

  const headers = [
    "Date",
    "Description",
    "Category",
    "Type",
    "Amount"
  ];

  const rows = transactions.map(
    (transaction) => [
      transaction.date || "",
      transaction.description || "",
      transaction.category || "",
      transaction.type || "",
      transaction.amount || 0
    ]
  );

  const csvContent = [
    headers,
    ...rows
  ]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  const fileName =
    selectedMonth === "all"
      ? "expense-dashboard-all-transactions.csv"
      : `expense-dashboard-${selectedMonth}.csv`;

  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return true;
};