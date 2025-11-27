document.getElementById('scrapeBtn').addEventListener('click', () => {
    const url = document.getElementById('profileUrl').value;
    const statusDiv = document.getElementById('status');

    // 1. Check if the box is empty
    if (!url) {
        statusDiv.innerText = "Please enter a valid URL!";
        statusDiv.style.color = "red";
        return;
    }

    statusDiv.innerText = "Opening tab...";
    statusDiv.style.color = "black";

    // 2. Open the new tab
    // The scraping magic will happen automatically in the next file we create
    chrome.tabs.create({ url: url });
});