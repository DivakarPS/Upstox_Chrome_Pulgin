# Upstox Chrome Extension

A Chrome extension to authenticate users via the Upstox API and fetch live stock data, displaying it directly in the popup interface.

## Features
- Secure OAuth2-based user authentication with the Upstox API.
- Fetches and displays live stock data dynamically in the extension popup.
- Simple configuration directly in `background.js`.

## File Structure
1. **manifest.json**: Defines the extension's metadata and required permissions.
2. **background.js**: Handles authentication, token management, and API requests.
3. **popup.html**: The UI template for the extension popup.
4. **popup.js**: Handles the logic for data retrieval and display in the popup.
5. **icon.png**: The extension icon displayed in the browser toolbar.

## Setup

### Prerequisites
1. **Client ID**: Obtain this unique identifier by registering your app on the [Upstox Developer Portal](https://account.upstox.com/contact-info).
2. **Client Secret**: A secure key provided alongside your Client ID, used for token exchange.
3. **Redirect URL**: The URL where users are redirected after successful authentication. This URL must match the one configured in your Upstox app settings (e.g., `https://<extension-id>.chromiumapp.org/`).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Open `background.js` and update the following constants with your Upstox API credentials:
   ```javascript
   const clientId = "your-client-id";         // Replace with your Upstox Client ID
   const clientSecret = "your-client-secret"; // Replace with your Upstox Client Secret
   const redirectUri = "your-redirect-url";   // Replace with your registered Redirect URL
   const authBaseUrl = "https://api.upstox.com/v2/login/authorization/dialog";
   const tokenUrl = "https://api.upstox.com/v2/login/authorization/token";
   const stockUrl = "https://api.upstox.com/v2/market-quote/ltp?instrument_key=NSE_EQ%7CINE848E01016";
   ```

3. Load the extension into Chrome:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top-right corner.
   - Click **Load unpacked** and select the folder containing the project files.

4. Use the extension:
   - Click the extension icon in Chrome.
   - Authenticate via the Upstox login popup.
   - View the fetched stock data in the extension popup interface.

## How It Works

1. **Authentication**:
   - The extension uses OAuth2 to authenticate users via the Upstox API.
   - After clicking the extension, users are redirected to the Upstox login page.
   - On successful login, the user is redirected to the `redirectUri`, and an authorization code is exchanged for an access token.

2. **Data Fetching**:
   - Once authenticated, the extension makes an API call to fetch the latest stock data using the access token.

3. **Displaying Data**:
   - The stock data is displayed in the popup window dynamically.

## License
This project is licensed under the MIT License. Feel free to use and modify it as per your requirements.

