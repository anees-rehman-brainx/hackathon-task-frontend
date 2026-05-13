/**
 * @param {{ message: string | null, children: import('react').ReactNode }} props
 */
export function ErrorBanner({ message, children }) {
  if (!message && !children) return null;
  return (
    <div className="bt-banner bt-banner--error" role="alert">
      {message && <p className="bt-banner__text">{message}</p>}
      {children}
    </div>
  );
}
