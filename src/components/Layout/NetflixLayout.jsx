export default function NetflixLayout({ header, hero, modes, rows }) {
  return (
    <div className="netflix-root">
      {header}

      <main className="netflix-content">
        <section className="netflix-hero">{hero}</section>
        <section className="netflix-modes">{modes}</section>

        {rows.map((row, i) => (
          <section key={i} className="netflix-row">
            {row}
          </section>
        ))}
      </main>
    </div>
  );
}
