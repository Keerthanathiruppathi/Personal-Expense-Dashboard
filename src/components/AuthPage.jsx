import { useState } from "react";

const USERS_STORAGE_KEY = "expense-dashboard-users";

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "{}");

    if (mode === "signup") {
      if (!form.name.trim() || !email || !form.password) {
        setError("Please complete all fields to create your account.");
        return;
      }

      if (users[email]) {
        setError("An account with this email already exists. Please log in.");
        return;
      }

      users[email] = {
        name: form.name.trim(),
        password: form.password
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      onAuthenticated({ name: form.name.trim(), email });
      return;
    }

    if (!users[email] || users[email].password !== form.password) {
      setError("The email or password is incorrect.");
      return;
    }

    onAuthenticated({ name: users[email].name, email });
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setForm({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-intro">
          <span className="auth-mark">₹</span>
          <p className="auth-eyebrow">PERSONAL FINANCE</p>
          <h1>Make every rupee count.</h1>
          <p className="auth-description">
            A calmer way to see your spending, plan your month, and stay in control.
          </p>
          <div className="auth-stat-row">
            <span><strong>01</strong> clear view</span>
            <span><strong>24/7</strong> at a glance</span>
          </div>
        </div>

        <div className="auth-form-wrap">
          <p className="auth-kicker">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</p>
          <h2>{mode === "login" ? "Log in to your dashboard" : "Create your account"}</h2>
          <p className="auth-subtitle">
            {mode === "login" ? "Pick up where you left off." : "Your financial workspace is a minute away."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label>
                Your name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Aarav Sharma" autoComplete="name" />
              </label>
            )}
            <label>
              Email address
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete={mode === "login" ? "current-password" : "new-password"} required />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit">
              {mode === "login" ? "Log in" : "Create account"} <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" onClick={switchMode}>{mode === "login" ? "Create an account" : "Log in"}</button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
