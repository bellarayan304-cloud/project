
import { useEffect, useState } from "react";

import "./App.css";

const API = "http://localhost:3000/api";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Other",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getTransactions() {
      try {
        if (!token) return;

        const response = await fetch(`${API}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Transactions lama soo heli karin");
        }

        const data = await response.json();

        setTransactions(
          Array.isArray(data)
            ? data
            : data.transactions || data.data || []
        );
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    getTransactions();
  }, [token]);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = income - expenses;

  const money = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  async function addTransaction(e) {
    e.preventDefault();

    try {
      if (!token) {
        alert("Fadlan marka hore login samee.");
        return;
      }

      const response = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Transaction lama kaydin");
      }

      const data = await response.json();

      const created = data.transaction || data.data || data;

      setTransactions((previous) => [created, ...previous]);

      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Other",
      });

      setShowForm(false);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <h2>Finora<span>.</span></h2>

        <p className="menu-title">MENU</p>

        <a className="active" href="#">▦ Overview</a>
        <a href="#transactions">↔ Transactions</a>
        <a href="#analytics">▥ Analytics</a>
        <a href="#categories">◇ Categories</a>

        <div className="sidebar-bottom">
          <p className="menu-title">ACCOUNT</p>
          <a href="#settings">⚙ Settings</a>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <small>Pages / Overview</small>
            <h3>Finance Dashboard</h3>
          </div>

          <button onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>
        </header>

        <section className="welcome">
          <h1>Welcome back! 👋</h1>
          <p>Halkan kala soco dhaqaalahaaga.</p>
        </section>

        <section className="stats">

          <div className="stat-card purple-card">
            <p>Total Balance</p>
            <h2>{money(balance)}</h2>
            <small>Income - Expenses</small>
          </div>

          <div className="stat-card">
            <p>Total Income</p>
            <h2 className="green">{money(income)}</h2>
            <small>Money received</small>
          </div>

          <div className="stat-card">
            <p>Total Expenses</p>
            <h2 className="red">{money(expenses)}</h2>
            <small>Money spent</small>
          </div>

          <div className="stat-card">
            <p>Net Savings</p>
            <h2>{money(balance)}</h2>
            <small>Remaining money</small>
          </div>

        </section>

        <section className="content-grid">

          <div className="panel" id="analytics">
            <h3>Financial Overview</h3>
            <p>Income vs Expenses</p>

            <div className="chart">
              <div>
                <span>Income</span>
                <strong>{money(income)}</strong>
                <div className="bar">
                  <div
                    className="income-bar"
                    style={{
                      width: `${income + expenses ? income / (income + expenses) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <span>Expenses</span>
                <strong>{money(expenses)}</strong>
                <div className="bar">
                  <div
                    className="expense-bar"
                    style={{
                      width: `${income + expenses ? expenses / (income + expenses) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="panel" id="categories">
            <h3>Quick Summary</h3>
            <p>Financial health</p>

            <div className="summary">
              <span>Income</span>
              <strong className="green">{money(income)}</strong>
            </div>

            <div className="summary">
              <span>Expenses</span>
              <strong className="red">{money(expenses)}</strong>
            </div>

            <div className="summary">
              <span>Balance</span>
              <strong>{money(balance)}</strong>
            </div>
          </div>

        </section>

        <section className="panel transactions" id="transactions">
          <div className="transaction-heading">
            <div>
              <h3>Recent Transactions</h3>
              <p>Dhaqdhaqaaqyadii ugu dambeeyey</p>
            </div>

            <button onClick={() => setShowForm(true)}>
              + Add New
            </button>
          </div>

          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="empty">
              Weli wax transactions ah ma jiraan.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title || item.description}</td>
                      <td>{item.category?.name || item.category || "Other"}</td>
                      <td>{item.type}</td>
                      <td className={item.type === "income" ? "green" : "red"}>
                        {money(item.amount)}
                      </td>
                      <td>
                        {new Date(item.date || item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={addTransaction}>

            <h2>New Transaction</h2>

            <label>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Transaction name"
            />

            <label>Amount</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              placeholder="0.00"
            />

            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <label>Category</label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <button type="submit">Save Transaction</button>

            <button
              type="button"
              className="cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
