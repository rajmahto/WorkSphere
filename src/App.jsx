import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HRDashboardPage from "./pages/HRDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Notification from "./components/Notification";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [notification, setNotification] = useState(null);

  const role = localStorage.getItem("role");

  const handleLogin = (loginNotification) => {
    setNotification(loginNotification);
    setLoggedIn(true);
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("currentHRPage");

    setLoggedIn(false);

    setNotification({
      type: "info",
      message: "You have been logged out."
    });
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {!loggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : role === "HR" ? (
        <HRDashboardPage
          onLogout={handleLogout}
          onNotify={setNotification}
        />
      ) : role === "ADMIN" ? (
        <AdminDashboardPage
          onLogout={handleLogout}
          onNotify={setNotification}
        />
      ) : (
        <DashboardPage
          onLogout={handleLogout}
          onNotify={setNotification}
        />
      )}
    </>
  );
}

export default App;