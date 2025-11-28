document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const url = document.getElementById('profileUrl').value;
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('scrapeBtn');

    if (!url) {
        statusDiv.innerText = "⚠️ Please enter a URL first.";
        statusDiv.style.color = "red";
        return;
    }

    // Change UI to show it's working
    statusDiv.innerText = "🚀 Launching target page...";
    statusDiv.style.color = "#1da1f2";
    btn.innerText = "Processing...";
    btn.disabled = true; // Stop them from clicking twice
    btn.style.backgroundColor = "#ccc";

    // Open the tab
    chrome.tabs.create({ url: url });
});