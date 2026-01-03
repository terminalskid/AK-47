const btn = document.getElementById("shorten");
const result = document.getElementById("result");

btn.onclick = async () => {
  const url = document.getElementById("url").value.trim();
  const slug = document.getElementById("slug").value.trim();

  result.textContent = "working...";

  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, slug })
  });

  const data = await res.json();

  if (data.error) {
    result.textContent = data.error;
  } else {
    result.innerHTML = `
      <a href="${data.short}" target="_blank">${data.short}</a>
    `;
  }
};
