document.getElementById("fetchStockData").addEventListener("click", () => {
    const outputDiv = document.getElementById("output");
    outputDiv.textContent = "Fetching stock data...";
  
    chrome.runtime.sendMessage({ type: "FETCH_STOCK_DATA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime Error:", chrome.runtime.lastError.message);
        outputDiv.textContent = "Error: " + chrome.runtime.lastError.message;
        return;
      }
  
      if (!response || !response.success) {
        console.error("Error in response:", response?.error || "Unknown error");
        outputDiv.textContent = "Error: " + (response?.error || "Unknown error");
        return;
      }
  
      // Handle the successful response and format data
      const stockData = response.data;
      let formattedOutput = "";
  
      if (stockData && stockData.data) {
          for (const instrumentKey in stockData.data) {
              if (stockData.data.hasOwnProperty(instrumentKey)) {
                  const stockInfo = stockData.data[instrumentKey];
                  const instrumentName = instrumentKey.split(':')[1];
                  const lastPrice = stockInfo.last_price;
  
                  formattedOutput += `Instrument: ${instrumentName}<br>`;
                  formattedOutput += `Last Traded Price: ${lastPrice}<br><br>`;
              }
          }
      } else {
          formattedOutput = "Error: Invalid data format received";
      }
  
      outputDiv.innerHTML = formattedOutput; // Use innerHTML to interpret <br> tags
    });
  });