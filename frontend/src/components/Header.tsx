import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import type { CurrentUser } from "../types/api";
import {
  fetchRandomDisplayName,
  loginUser,
  registerUser,
  updateDisplayName,
} from "../api/users";

type HeaderProps = {
  currentUser: CurrentUser | null;
  onCurrentUserChange: (user: CurrentUser) => void;
};

function Header({
  currentUser,
  onCurrentUserChange,
}: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDisplayNameOpen, setIsDisplayNameOpen] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(currentUser?.displayUserName ?? "");

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOverlayMouseDown, setIsOverlayMouseDown] = useState(false);

  useEffect(() => {
    setDisplayName(currentUser?.displayUserName ?? "");
  }, [currentUser?.displayUserName]);

  const handleGenerateRandomName = async () => {
    try {
      const generated = await fetchRandomDisplayName();
      setDisplayName(generated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      setAuthError("ユーザーIDおよびパスワードを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError(null);

      const user = await loginUser({
        loginId: loginId.trim(),
        password: password.trim(),
      });

      onCurrentUserChange(user);
      setIsLoginOpen(false);
      setLoginId("");
      setPassword("");
    } catch (error) {
      setAuthError("ユーザーIDまたはパスワードが違います");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!loginId.trim() || !password.trim()) {
      setAuthError("ユーザーIDおよびパスワードを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError(null);

      const user = await registerUser({
        loginId: loginId.trim(),
        password: password.trim(),
        displayName: displayName.trim() || null,
      });

      onCurrentUserChange(user);
      setIsRegisterOpen(false);
      setLoginId("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error && error.message.includes("already in use")) {
        setAuthError("このユーザーIDはすでに登録されています");
      } else {
        setAuthError("登録に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      const user = await updateDisplayName(displayName.trim() || null);
      onCurrentUserChange(user);
      setIsDisplayNameOpen(false);
    } catch (error) {
      setAuthError("表示名の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className={styles.header}>
      {isLoginOpen && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOverlayMouseDown(true);
            }
          }}
          onMouseUp={(event) => {
            if (
              isOverlayMouseDown &&
              event.target === event.currentTarget
            ) {
              setIsLoginOpen(false);
            }
            setIsOverlayMouseDown(false);
          }}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <h2>ログイン</h2>

            <input
              className={styles.modalInput}
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="ユーザーID"
            />
            <input
              className={styles.modalInput}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="パスワード"
            />

            {authError && <p className={styles.modalError}>{authError}</p>}

            <button
              type="button"
              className={styles.modalSubmitButton}
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "ログイン"}
            </button>
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOverlayMouseDown(true);
            }
          }}
          onMouseUp={(event) => {
            if (
              isOverlayMouseDown &&
              event.target === event.currentTarget
            ) {
              setIsRegisterOpen(false);
            }
            setIsOverlayMouseDown(false);
          }}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <h2>ユーザー登録</h2>

            <div className={styles.displayNameRow}>
              <input
                className={styles.modalInput}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="表示名"
              />
              <button
                type="button"
                className={styles.modalSubButton}
                onClick={handleGenerateRandomName}
              >
                ランダム生成
              </button>
            </div>

            <input
              className={styles.modalInput}
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="ユーザーID"
            />
            <input
              className={styles.modalInput}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="パスワード"
            />

            {authError && <p className={styles.modalError}>{authError}</p>}

            <button
              type="button"
              className={styles.modalSubmitButton}
              onClick={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "登録"}
            </button>
          </div>
        </div>
      )}

      {isDisplayNameOpen && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOverlayMouseDown(true);
            }
          }}
          onMouseUp={(event) => {
            if (
              isOverlayMouseDown &&
              event.target === event.currentTarget
            ) {
              setIsDisplayNameOpen(false);
            }
            setIsOverlayMouseDown(false);
          }}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <h2>表示名変更</h2>

            <div className={styles.displayNameRow}>
              <input
                className={styles.modalInput}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="表示名"
              />
              <button
                type="button"
                className={styles.modalSubButton}
                onClick={handleGenerateRandomName}
              >
                ランダム生成
              </button>
            </div>

            {authError && <p className={styles.modalError}>{authError}</p>}

            <button
              type="button"
              className={styles.modalSubmitButton}
              onClick={handleUpdateDisplayName}
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "決定"}
            </button>
          </div>
        </div>
      )}
      <h1 className={styles.title}>
        ななポケ図鑑
      </h1>

      <div className={styles.userArea}>
        <div className={styles.userNameRow}>
          <span className={styles.userName}>
            {currentUser?.displayUserName ?? "ユーザー"}
          </span>
          <span className={styles.userNameSuffix}>さん</span>
          <button
            type="button"
            className={styles.userActionButton}
            onClick={() => {
              setAuthError(null);
              setDisplayName(currentUser?.displayUserName ?? "");
              setIsDisplayNameOpen(true);
            }}
          >
            変更
          </button>
        </div>

        {currentUser?.isGuest && (
          <div className={styles.authButtonRow}>
            <button
              type="button"
              className={styles.userActionButton}
              onClick={() => {
                setAuthError(null);
                setLoginId("");
                setPassword("");
                setIsRegisterOpen(true);
              }}
            >
              ユーザー登録
            </button>

            <button
              type="button"
              className={styles.userActionButton}
              onClick={() => {
                setAuthError(null);
                setLoginId("");
                setPassword("");
                setIsLoginOpen(true);
              }}
            >
              ログイン
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;