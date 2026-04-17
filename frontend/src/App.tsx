import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import type { CurrentUser } from "./types/api";
import { createGuestUser, fetchCurrentUser } from "./api/users";

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isInitializingUser, setIsInitializingUser] = useState(true);
  const [userInitError, setUserInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initUser() {
      try {
        setIsInitializingUser(true);
        setUserInitError(null);

        try {
          const me = await fetchCurrentUser();

          if (!cancelled) {
            setCurrentUser(me);
          }
        } catch {
          const guest = await createGuestUser();

          if (!cancelled) {
            setCurrentUser(guest);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setUserInitError(
            error instanceof Error ? error.message : "ユーザー初期化に失敗しました",
          );
        }
      } finally {
        if (!cancelled) {
          setIsInitializingUser(false);
        }
      }
    }

    initUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isInitializingUser) {
    return <div>ユーザー情報を初期化しています...</div>;
  }

  if (userInitError) {
    return <div>エラー: {userInitError}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              currentUser={currentUser}
              onCurrentUserChange={setCurrentUser}
            />
          }
        />
        <Route
          path="/pokemon/:id"
          element={
            <DetailPage
              currentUser={currentUser}
              onCurrentUserChange={setCurrentUser}
            />
          }
        />
        <Route
          path="/other/:id"
          element={
            <DetailPage
              currentUser={currentUser}
              onCurrentUserChange={setCurrentUser}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;