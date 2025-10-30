const form = document.getElementById('transaction-form');
const tbody = document.querySelector('#transactions tbody');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const totalSavingsEl = document.getElementById('total-savings');
const pieCtx = document.getElementById('pieChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function render() {
  tbody.innerHTML = '';
  let income = 0, expense = 0;
  const monthly = {};

  transactions.forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.desc}</td>
      <td>${t.type}</td>
      <td>$${t.amount.toFixed(2)}</td>
      <td>${t.date}</td>
      <td><button onclick="deleteTransaction(${i})">❌</button></td>
    `;
    tbody.appendChild(tr);

    if (t.type === 'income') income += t.amount;
    else expense += t.amount;

    if (!monthly[t.date]) monthly[t.date] = { income: 0, expense: 0 };
    monthly[t.date][t.type] += t.amount;
  });

  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  totalSavingsEl.textContent = `$${(income - expense).toFixed(2)}`;
  localStorage.setItem('transactions', JSON.stringify(transactions));

  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#48bb78', '#f56565']
      }]
    }
  });

  if (window.barChart) window.barChart.destroy();
  const months = Object.keys(monthly);
  const incData = months.map(m => monthly[m].income);
  const expData = months.map(m => monthly[m].expense);
  window.barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: incData, backgroundColor: '#68d391' },
        { label: 'Expense', data: expData, backgroundColor: '#fc8181' }
      ]
    }
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const dateInput = document.getElementById('date').value;
const date = dateInput ? new Date(dateInput).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
transactions.push({ desc, amount, type, date });

  form.reset();
  render();
});

function deleteTransaction(i) {
  transactions.splice(i, 1);
  render();
}

render();
