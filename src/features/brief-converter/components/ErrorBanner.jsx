import styles from "./ErrorBanner.module.css";

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={styles.wrap} role="alert">
      <span className={styles.icon} aria-hidden>
        !
      </span>
      <div className={styles.body}>
        <p className={styles.title}>Request failed</p>
        <p className={styles.text}>{message}</p>
      </div>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} onClick={onDismiss}>
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
