// ========== Utility: Hash Text ==========
async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ========== Elements ==========
const loginScreen = document.getElementById('login-screen');
const financeApp = document.getElementById('finance-app');
const loginBox = document.getElementById('login-box');
const forgotBox = document.getElementById('forgot-box');
const welcomeUser = document.getElementById('welcomeUser');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const togglePwd = document.getElementById('togglePwd');
const forgotPwdBtn = document.getElementById('forgotPwdBtn');
const resetBtn = document.getElementById('resetBtn');
const backToLogin = document.getElementById('backToLogin');

let currentUser = null;
let transactions = [];

// ========== Toggle Password Visibility ==========
togglePwd.addEventListener('click', () => {
  const pwd = document.getElementById('password');
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
});

// ========== Login / Register ==========
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const secQ = document.getElementById('secQuestion').value.trim();
  const secA = document.getElementById('secAnswer').value.trim();

  if (!username || !password) return alert('Please enter username and password.');

  const userKey = `user_${username}`;
  const userData = localStorage.getItem(userKey);
  const hashedPwd = await hashText(password);

  if (userData) {
    const { hash, question, answer } = JSON.parse(userData);
    if (hash !== hashedPwd) return alert('Incorrect password!');
  } else {
    if (!secQ || !secA) return alert('Set security question and answer for new user.');
    const hashedAns = await hashText(secA);
    localStorage.setItem(userKey, JSON.stringify({ hash: hashedPwd, question: secQ, answer: hashedAns }));
    alert('✅ New user created securely!');
  }

  currentUser = username;
  welcomeUser.textContent = `Welcome, ${username}`;
  loginScreen.style.display = 'none';
  financeApp.style.display = 'block';
  loadData();
  render();
});

// ========== Forgot Password ==========
forgotPwdBtn.addEventListener('click', () => {
  loginBox.style.display = 'none';
  forgotBox.style.display = 'block';
});

backToLogin.addEventListener('click', () => {
  forgotBox.style.display = 'none';
  loginBox.style.display = 'block';
});

resetBtn.addEventListener('click', async () => {
  const username = document.getElementById('resetUser').value.trim();
  const answer = document.getElementById('resetAnswer').value.trim();
  const newPass = document.getElementById('newPassword').value.trim();
  if (!username || !answer || !newPass) return alert('Please fill all fields.');

  const userKey = `user_${username}`;
  const userData = localStorage.getItem(userKey);
  if (!userData) return alert('User not found.');

  const { question, answer: savedAns } = JSON.parse(userData);
  const hashedAns = await hashText(answer);

  if (hashedAns !== savedAns) return alert('Wrong security answer!');
  const newHash = await hashText(newPass);
  localStorage.setItem(userKey, JSON.stringify({ hash: newHash, question, answer: savedAns }));
  alert('✅ Password reset successfully!');
  backToLogin.click();
});

// ========== Logout ==========
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  transactions = [];
  financeApp.style.display = 'none';
  loginScreen.style.display = 'flex';
  loginBox.style.display = 'block';
  forgotBox.style.display = 'none';
});

// ========== Data Management ==========
function saveData() {
  localStorage.setItem(`financeData_${currentUser}`, JSON.stringify(transactions));
}

function loadData() {
  const saved = localStorage.getItem(`financeData_${currentUser}`);
  transactions = saved ? JSON.parse(saved) : [];
}

// ========== Render UI ==========
function render() {
  const tbody = document.querySelector('#transactions tbody');
  const totalIncomeEl = document.getElementById('total-income');
  const totalExpenseEl = document.getElementById('total-expense');
  const totalSavingsEl = document.getElementById('total-savings');
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const barCtx = document.getElementById('barChart').getContext('2d');

  tbody.innerHTML = '';
  let income = 0, expense = 0;
  const monthly = {};

  transactions.forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.desc}</td>
      <td>${t.type}</td>
      <td>$${t.amount.toFixed(2)}</td>
      <td>${new Date(t.date).toLocaleDateString()}</td>
      <td>${t.remarks || '-'}</td>
      <td><button onclick="deleteTx(${i})">❌</button></td>`;
    tbody.appendChild(tr);

    if (t.type === 'income') income += t.amount; else expense += t.amount;
    const month = t.date.slice(0,7);
    if (!monthly[month]) monthly[month] = { income:0, expense:0 };
    monthly[month][t.type] += t.amount;
  });

  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  totalSavingsEl.textContent = `$${(income - expense).toFixed(2)}`;
  saveData();

  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: { labels: ['Income','Expense'], datasets: [{ data:[income,expense], backgroundColor:['#48bb78','#f56565'] }] }
  });

  if (window.barChart) window.barChart.destroy();
  const months = Object.keys(monthly);
  const inc = months.map(m => monthly[m].income);
  const exp = months.map(m => monthly[m].expense);
  window.barChart = new Chart(barCtx, {
    type:'bar',
    data:{ labels:months, datasets:[
      { label:'Income', data:inc, backgroundColor:'#68d391' },
      { label:'Expense', data:exp, backgroundColor:'#fc8181' }
    ]}
  });
}

// ========== Add / Delete Transaction ==========
document.getElementById('transaction-form').addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const remarks = document.getElementById('remarks').value.trim();
  const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
  transactions.push({ desc, amount, type, date, remarks });
  e.target.reset();
  render();
});

function deleteTx(i) { transactions.splice(i,1); render(); }

// ========== Export to Excel ==========
document.getElementById('exportExcel').addEventListener('click',()=>{
  if(transactions.length===0)return alert('No transactions!');
  const ws=XLSX.utils.json_to_sheet(transactions);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Transactions");
  XLSX.writeFile(wb,`${currentUser}_Finance_Report.xlsx`);
});

// ========== Register Service Worker ==========
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
