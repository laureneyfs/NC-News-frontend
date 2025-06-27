export function Error({ message, children }) {
  return (
    <section className="error-card">
      <h2>Error: {message}</h2>
      {children}
    </section>
  );
}
