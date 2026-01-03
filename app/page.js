import "./styles.css";

export default function Home() {
  return (
    <main className="wrap">
      <h1>AKShort</h1>
      <p className="tagline">fast. free. no bullshit.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const url = e.target.url.value;
          const slug = e.target.slug.value;

          const res = await fetch("/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, slug })
          });

          const data = await res.json();
          alert(data.short || data.error);
        }}
      >
        <input name="url" placeholder="https://long-link.com" />
        <input name="slug" placeholder="custom" />
        <button>SHORTEN</button>
      </form>

      <div className="links">
        <a href="https://guns.lol/skidboi">My Links</a>
        <a href="https://github.com/terminalskid">GitHub</a>
      </div>
    </main>
  );
}
