import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Notification from "./components/Notification";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [notification, setNotification] = useState(null);

  const handleLogin = (loginNotification) => {

    setNotification(loginNotification);

    setLoggedIn(true);
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

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

      {loggedIn ? (
        <DashboardPage
          onLogout={handleLogout}
          onNotify={setNotification}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;