console.log("Social Scraper: Script loaded!");

// Wait 5 seconds for the page to load fully
setTimeout(scrapeData, 5000);

function scrapeData() {
    const currentUrl = window.location.href;
    let scrapedPosts = [];

    // --- TWITTER (X) LOGIC ---
    if (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) {
        console.log("Scraping X...");
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        
        tweets.forEach((tweet, index) => {
            if (index >= 20) return; // Limit to 20 posts

            // Get Text and clean it (remove new lines so Excel doesn't break)
            const textEl = tweet.querySelector('div[data-testid="tweetText"]');
            const text = textEl ? textEl.innerText.replace(/(\r\n|\n|\r)/gm, " ") : "Media Only"; 
            
            // Get Time
            const timeEl = tweet.querySelector('time');
            const time = timeEl ? timeEl.getAttribute('datetime') : "Unknown";

            scrapedPosts.push({ Source: "Twitter", Post: text, Time: time });
        });
    } 
    
    // --- REDDIT LOGIC ---
    else if (currentUrl.includes("reddit.com")) {
        console.log("Scraping Reddit...");
        const posts = document.querySelectorAll('shreddit-post');
        
        posts.forEach((post, index) => {
             if (index >= 20) return;

             const title = post.getAttribute('post-title').replace(/,/g, ""); // Remove commas
             const author = post.getAttribute('author');

             scrapedPosts.push({ Source: "Reddit", Post: title, Author: author });
        });
    }

    // --- DOWNLOAD THE FILE ---
    if (scrapedPosts.length > 0) {
        downloadCSV(scrapedPosts); 
    } else {
        alert("No posts found. Try scrolling down manually and running it again.");
    }
}

// Helper function to create the CSV file
function downloadCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Source,Post Content,Time/Author\n";

    // Rows
    data.forEach(row => {
        let extraInfo = row.Time || row.Author || "N/A";
        // Clean quotes so Excel reads it correctly
        let cleanText = row.Post.replace(/"/g, '""'); 
        let rowString = `${row.Source},"${cleanText}",${extraInfo}`;
        csvContent += rowString + "\n";
    });

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "social_media_data.csv");
    document.body.appendChild(link);
    link.click();
}