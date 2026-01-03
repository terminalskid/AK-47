const btn = document.getElementById("shorten");
const result = document.getElementById("result");

btn.onclick = async () => {
  const url = document.getElementById("url").value.trim();
  const slug = document.getElementById("slug").value.trim();

  if (!url || !slug) {
    result.textContent = "missing fields";
    return;
  }

  result.textContent = "working...";

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
    `;
  } catch (e) {
    result.textContent = "api error";
  }
};
