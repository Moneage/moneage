const STRAPI_URL = 'https://moneage-backend.onrender.com';

async function fetchAPI(path, queryString = '') {
    const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;
    console.log(`Fetching: ${requestUrl}`);

    try {
        const response = await fetch(requestUrl);
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function test() {
    console.log("--- Testing Articles ---");
    const articles = await fetchAPI('/articles');
    console.log("Articles Data:", JSON.stringify(articles, null, 2));

    console.log("\n--- Testing Categories ---");
    const categories = await fetchAPI('/categories');
    console.log("Categories Data:", JSON.stringify(categories, null, 2));

    console.log("\n--- Testing Specific Category (Investing) ---");
    // Manual query string for filters[slug]=investing
    const investing = await fetchAPI('/categories', 'filters[slug]=investing');
    console.log("Investing Category Data:", JSON.stringify(investing, null, 2));
}

test();
