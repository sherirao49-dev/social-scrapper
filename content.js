console.log("Social Scraper: Slow-Internet Mode Loaded");

// Wait 5 seconds for the page to open completely
setTimeout(startSmartScrape, 5000);

let uniquePosts = new Map();

async function startSmartScrape() {
    const isTwitter = window.location.href.includes("twitter.com") || window.location.href.includes("x.com");
    const isReddit = window.location.href.includes("reddit.com");
    
    console.log("Starting Scrape...");

    let attempts = 0;
    // Keep going until we have 20 posts OR we have tried 20 times
    while (uniquePosts.size < 20 && attempts < 20) {
        
        // 1. Grab what is currently on screen
        if (isTwitter) {
            scrapeTwitterChunk();
        } else if (isReddit) {
            scrapeRedditChunk();
        }

        console.log(`Collected ${uniquePosts.size} posts... Scrolling down...`);
        
        // 2. Scroll to the very bottom of the page (Forces new tweets to load)
        window.scrollTo(0, document.body.scrollHeight);
        
        // 3. WAIT 4 SECONDS (Important for slow loading)
        await new Promise(r => setTimeout(r, 4000));
        
        attempts++;
    }

    console.log("Finished! Downloading...");
    downloadCSV();
}

function scrapeTwitterChunk() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach((tweet) => {
        const textEl = tweet.querySelector('div[data-testid="tweetText"]');
        if (!textEl) return;
        
        const text = textEl.innerText.replace(/(\r\n|\n|\r)/gm, " ");
        const timeEl = tweet.querySelector('time');
        const time = timeEl ? timeEl.getAttribute('datetime') : "Unknown";

        if (!uniquePosts.has(text)) {
            uniquePosts.set(text, { Source: "Twitter", Post: text, Time: time });
        }
    });
}

function scrapeRedditChunk() {
    const posts = document.querySelectorAll('shreddit-post');
    posts.forEach((post) => {
         const title = post.getAttribute('post-title');
         if (!title) return;

         const cleanTitle = title.replace(/,/g, ""); 
         const author = post.getAttribute('author');

         if (!uniquePosts.has(cleanTitle)) {
             uniquePosts.set(cleanTitle, { Source: "Reddit", Post: cleanTitle, Author: author });
         }
    });
}

function downloadCSV() {
    if (uniquePosts.size === 0) {
        alert("No posts found. Please check your connection.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Source,Post Content,Time/Author\n";

    uniquePosts.forEach((row) => {
        let extraInfo = row.Time || row.Author || "N/A";
        let cleanText = row.Post.replace(/"/g, '""'); 
        let rowString = `${row.Source},"${cleanText}",${extraInfo}`;
        csvContent += rowString + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    // Added a random number to filename so you know which one is new
    link.setAttribute("download", `social_data_${Math.floor(Math.random() * 100)}.csv`);
    document.body.appendChild(link);
    link.click();
    
    alert(`Success! Downloaded ${uniquePosts.size} posts.`);
}