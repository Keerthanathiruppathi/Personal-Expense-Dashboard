import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = ({
  transactions,
  selectedMonth,
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
  monthlyBudget,
  budgetRemaining,
  budgetPercentage,
  topCategory,
  topCategoryAmount,
  averageExpense,
  highestExpense
}) => {
  if (
    !transactions ||
    transactions.length === 0
  ) {
    return false;
  }

  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const formatCurrency = (value) => {
    return `Rs. ${Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    )}`;
  };

  const formatMonth = (monthValue) => {
    if (monthValue === "all") {
      return "All Months";
    }

    const [year, month] =
      monthValue.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );
  };

  const reportMonth =
    formatMonth(selectedMonth);

  /*
   * HEADER
   */

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Personal Expense Dashboard",
    pageWidth / 2,
    20,
    {
      align: "center"
    }
  );

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Financial Report",
    pageWidth / 2,
    29,
    {
      align: "center"
    }
  );

  doc.setFontSize(11);

  doc.text(
    `Period: ${reportMonth}`,
    pageWidth / 2,
    38,
    {
      align: "center"
    }
  );

  /*
   * SUMMARY
   */

  autoTable(doc, {
    startY: 48,

    head: [
      [
        "Financial Summary",
        "Amount"
      ]
    ],

    body: [
      [
        "Total Income",
        formatCurrency(
          totalIncome
        )
      ],
      [
        "Total Expenses",
        formatCurrency(
          totalExpenses
        )
      ],
      [
        "Balance",
        formatCurrency(
          balance
        )
      ],
      [
        "Savings Rate",
        `${savingsRate.toFixed(1)}%`
      ],
      [
        "Monthly Budget",
        monthlyBudget > 0
          ? formatCurrency(
              monthlyBudget
            )
          : "Not Set"
      ],
      [
        "Budget Used",
        monthlyBudget > 0
          ? `${budgetPercentage.toFixed(
              1
            )}%`
          : "N/A"
      ],
      [
        "Remaining Budget",
        monthlyBudget > 0
          ? formatCurrency(
              budgetRemaining
            )
          : "N/A"
      ]
    ],

    theme: "grid",

    headStyles: {
      fontStyle: "bold"
    }
  });

  /*
   * ANALYTICS
   */

  let analyticsStart =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Spending Analytics",
    14,
    analyticsStart
  );

  autoTable(doc, {
    startY:
      analyticsStart + 5,

    head: [
      [
        "Metric",
        "Value"
      ]
    ],

    body: [
      [
        "Average Expense",
        formatCurrency(
          averageExpense
        )
      ],
      [
        "Highest Expense",
        formatCurrency(
          highestExpense
        )
      ],
      [
        "Top Spending Category",
        topCategory
      ],
      [
        "Top Category Amount",
        formatCurrency(
          topCategoryAmount
        )
      ]
    ],

    theme: "grid",

    headStyles: {
      fontStyle: "bold"
    }
  });

  /*
   * CATEGORY SUMMARY
   */

  const categoryTotals = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type ===
        "expense"
    )
    .forEach(
      (transaction) => {
        const category =
          transaction.category ||
          "Other";

        categoryTotals[
          category
        ] =
          (categoryTotals[
            category
          ] || 0) +
          Number(
            transaction.amount
          );
      }
    );

  const categoryRows =
    Object.entries(
      categoryTotals
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([category, amount]) => [
          category,
          formatCurrency(
            amount
          )
        ]
      );

  let categoryStart =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);

  doc.text(
    "Expense by Category",
    14,
    categoryStart
  );

  autoTable(doc, {
    startY:
      categoryStart + 5,

    head: [
      [
        "Category",
        "Amount"
      ]
    ],

    body:
      categoryRows.length > 0
        ? categoryRows
        : [
            [
              "No expenses",
              "Rs. 0"
            ]
          ],

    theme: "grid",

    headStyles: {
      fontStyle: "bold"
    }
  });

  /*
   * TRANSACTION HISTORY
   */

  let transactionStart =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);

  doc.text(
    "Transaction History",
    14,
    transactionStart
  );

  const transactionRows =
    transactions.map(
      (transaction) => [
        transaction.date || "-",
        transaction.description ||
          "-",
        transaction.category ||
          "Other",
        transaction.type ===
        "income"
          ? "Income"
          : "Expense",
        formatCurrency(
          transaction.amount
        )
      ]
    );

  autoTable(doc, {
    startY:
      transactionStart + 5,

    head: [
      [
        "Date",
        "Description",
        "Category",
        "Type",
        "Amount"
      ]
    ],

    body:
      transactionRows,

    theme: "striped",

    headStyles: {
      fontStyle: "bold"
    },

    styles: {
      fontSize: 8
    }
  });

  /*
   * FOOTER
   */

  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {
    doc.setPage(page);

    const pageHeight =
      doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `Personal Expense Dashboard • Page ${page} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      {
        align: "center"
      }
    );
  }

  const fileName =
    selectedMonth === "all"
      ? "personal-expense-financial-report.pdf"
      : `personal-expense-report-${selectedMonth}.pdf`;

  doc.save(fileName);

  return true;
};