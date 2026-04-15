import styles from "./Spinner.module.css";

/**
 * @param {{ size?: "sm" | "md", label?: string }} props
 */
export function Spinner({ size = "md", label = "Loading" }) {
  const sizeClass = size === "sm" ? styles.sm : styles.md;
  return (
    <span
      className={`${styles.root} ${sizeClass}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={styles.ring} aria-hidden />
    </span>
  );
}
