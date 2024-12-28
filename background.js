const clientId = "26e551bd-a1ad-4df6-85c2-01aac24507e1";
const clientSecret = "nix6b31wa4";
const tokenUrl = "https://api.upstox.com/v2/login/authorization/token";
const authBaseUrl = "https://api.upstox.com/v2/login/authorization/dialog";
const stockUrl = "https://api.upstox.com/v2/market-quote/ltp?instrument_key=NSE_EQ%7CINE848E01016";
const redirectUri = chrome.identity.getRedirectURL();


let accessToken = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.type === "FETCH_STOCK_DATA") {
        (async () => {
            try {
                if (!accessToken) {
                  console.log("Authenticating user...");
                    accessToken = await authenticateUser();
                    console.log("Access token obtained:", accessToken);
                }

                // Fetch the stock data
                const stockData = await fetchStockData();
                console.log("Stock data fetched:", stockData);

                sendResponse({ success: true, data: stockData });
            } catch (error) {
                console.error("Error fetching stock data:", error);
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});


async function authenticateUser() {
    const authUrl = `${authBaseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code&state=random_state`;

    const redirectResponse = await new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            { url: authUrl, interactive: true },
            redirectUri => {
                console.log("Authorization URL:", authUrl);
                console.log("redirect URI:", redirectUri);
                if (chrome.runtime.lastError || !redirectUri) {
                    reject(new Error("Authorization failed"));
                    return;
                }
                resolve(redirectUri);
            }
        );
    });
    console.log("Redirect Response:", redirectResponse);

    const urlParams = new URLSearchParams(new URL(redirectResponse).search);
    const code = urlParams.get("code");

    if (!code) throw new Error("Authorization code missing");

    const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error_description || "Failed to fetch token");

    return tokenData.access_token;
}

async function fetchStockData() {

    const response = await fetch(stockUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch stock data");
    }

    return response.json();
}