const btn = document.getElementById("shorten");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {
  const url = document.getElementById("url").value.trim();
  const slug = document.getElementById("slug").value.trim();

  result.textContent = "shortening...";

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, slug })
    });

    const data = await res.json();

    if (!res.ok) {
      result.textContent = data.error || "error";
      return;
    }

    result.innerHTML = `
      <a href="${data.short}" target="_blank">${data.short}</a>
      <br/>
      <small>(click to open)</small>
    `;
  } catch {
    result.textContent = "network error";
  }
});
