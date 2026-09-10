function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-mark">₹</span>
        <div>
          <strong>Ledgerly</strong>
          <span>Personal finance</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        <p className="sidebar-label">WORKSPACE</p>
        <a className="sidebar-link active" href="#overview"><span>◈</span> Overview</a>
        <a className="sidebar-link" href="#analytics"><span>◒</span> Analytics</a>
        <a className="sidebar-link" href="#transactions"><span>▤</span> Transactions</a>
        <a className="sidebar-link" href="#add-transaction"><span>＋</span> Add transaction</a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout} type="button">
          <span aria-hidden="true">↪</span> Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
