// Alpha Vantage API key
const API_KEY = 'your-alpha-vantage-api-key';
const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${API_KEY}&symbol=`;

// Fetch trending stocks
const trendingStocks = ["MSFT", "GOOG", "TSLA", "AAPL"];
const dropdown = document.getElementById('stock-dropdown');

// Populate dropdown with trending stocks
trendingStocks.forEach(stock => {
    const option = document.createElement('option');
    option.value = stock;
    option.textContent = stock;
    dropdown.appendChild(option);
});

async function fetchStockData(symbol) {
    const response = await fetch(API_URL + symbol);
    const data = await response.json();
    return data['Time Series (Daily)'];
}

function displayStockData(data, symbol) {
    const stockInfo = document.getElementById('stock-info');
    const table = document.getElementById('stock-table').querySelector('tbody');
    const latestDate = Object.keys(data)[0];
    const latestData = data[latestDate];

    stockInfo.innerHTML = `
        <h3>${symbol} Latest Data</h3>
        <p>Date: ${latestDate}</p>
        <p>Price: $${latestData['4. close']}</p>
        <p>Volume: ${latestData['5. volume']}</p>
    `;

    const row = table.insertRow();
    row.insertCell(0).textContent = symbol;
    row.insertCell(1).textContent = `$${latestData['4. close']}`;
    row.insertCell(2).textContent = latestData['5. volume'];
}

function plotStockGraph(data) {
    const dates = Object.keys(data).reverse();
    const prices = dates.map(date => parseFloat(data[date]['4. close']));

    const ctx = document.getElementById('stock-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: '#00e6e6',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

document.getElementById('search-stock').addEventListener('click', async () => {
    const stockSymbol = document.getElementById('stock-symbol').value.toUpperCase();
    if (stockSymbol) {
        const data = await fetchStockData(stockSymbol);
        displayStockData(data, stockSymbol);
        plotStockGraph(data);
    }
});

document.getElementById('clear-table').addEventListener('click', () => {
    document.getElementById('stock-table').querySelector('tbody').innerHTML = '';
});

dropdown.addEventListener('change', async () => {
    const selectedStock = dropdown.value;
    const data = await fetchStockData(selectedStock);
    displayStockData(data, selectedStock);
    plotStockGraph(data);
});
