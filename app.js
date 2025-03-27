document.addEventListener('DOMContentLoaded', function() {
    // Get all input fields
    const goldInput = document.querySelector('input[placeholder="Total Gold Value"]') || document.getElementById('gold') || document.querySelector('input:nth-of-type(1)');
    const silverInput = document.querySelector('input[placeholder="Total Silver Value"]') || document.getElementById('silver') || document.querySelector('input:nth-of-type(2)');
    const cashInput = document.querySelector('input[placeholder="Cash on Hand"]') || document.getElementById('cash') || document.querySelector('input:nth-of-type(3)');
    const savingsInput = document.querySelector('input[placeholder="Saving Account"]') || document.getElementById('savings') || document.querySelector('input:nth-of-type(4)');
    const businessBankInput = document.querySelector('input[placeholder="Business Bank Account"]') || document.getElementById('businessBank') || document.querySelector('input:nth-of-type(5)');
    const insuranceInput = document.querySelector('input[placeholder="Insurance Value"]') || document.getElementById('insurance') || document.querySelector('input:nth-of-type(6)');
    const realEstateInput = document.querySelector('input[placeholder="Real State Property"]') || document.getElementById('realEstate') || document.querySelector('input:nth-of-type(7)');
    const merchandiseInput = document.querySelector('input[placeholder="Merchandise Inventory"]') || document.getElementById('merchandise') || document.querySelector('input:nth-of-type(8)');
    const stocksInput = document.querySelector('input[placeholder="Storck & Mutual Funds"]') || document.getElementById('stocks') || document.querySelector('input:nth-of-type(9)');
    const liabilitiesInput = document.querySelector('input[placeholder="Liabilities"]') || document.getElementById('liabilities') || document.querySelector('input:nth-of-type(10)');
    
    // Get result elements
    const totalAssetsElement = document.getElementById('totalAssets') || document.querySelector('.total-assets') || document.querySelectorAll('p')[0] || document.querySelectorAll('div')[document.querySelectorAll('div').length - 3];
    const payZakatElement = document.getElementById('payZakat') || document.querySelector('.pay-zakat') || document.querySelectorAll('p')[1] || document.querySelectorAll('div')[document.querySelectorAll('div').length - 2];
    
    // Get calculate button
    const calculateButton = document.querySelector('button') || document.getElementById('calculate');
    
    // Default gold and silver prices (fallback values if API fails)
    let goldPricePerGram = 85; // Default price in BDT
    let silverPricePerGram = 1.5; // Default price in BDT
    
    // Nisab thresholds (based on gold and silver)
    const goldNisabGrams = 87.48; // 7.5 tolas or 87.48 grams of gold
    const silverNisabGrams = 612.36; // 52.5 tolas or 612.36 grams of silver
    
    // Zakat rate
    const zakatRate = 0.025; // 2.5%
    
    // Function to fetch current gold and silver prices from API
    async function fetchMetalPrices() {
        try {
            // Using the Metal Price API (you may need to sign up for an API key)
            const response = await fetch('https://api.metals.live/v1/spot');
            const data = await response.json();
            
            // Extract gold and silver prices (in USD per troy ounce)
            const goldPriceUSD = data.find(metal => metal.name === 'Gold')?.price || 0;
            const silverPriceUSD = data.find(metal => metal.name === 'Silver')?.price || 0;
            
            // Convert from USD per troy ounce to BDT per gram
            // 1 troy ounce = 31.1035 grams
            // Using an approximate USD to BDT conversion rate (adjust as needed)
            const usdToBDT = 110; // Example conversion rate
            
            if (goldPriceUSD > 0) {
                goldPricePerGram = (goldPriceUSD / 31.1035) * usdToBDT;
            }
            
            if (silverPriceUSD > 0) {
                silverPricePerGram = (silverPriceUSD / 31.1035) * usdToBDT;
            }
            
            console.log(`Current gold price: ${goldPricePerGram.toFixed(2)} BDT/gram`);
            console.log(`Current silver price: ${silverPricePerGram.toFixed(2)} BDT/gram`);
            
            // Update calculation with new prices
            calculateZakat();
            
        } catch (error) {
            console.error('Error fetching metal prices:', error);
            // Use default values if API fails
            alert('Could not fetch current metal prices. Using default values instead.');
            calculateZakat();
        }
    }
    
    // Alternative API for metal prices (in case the first one fails)
    async function fetchMetalPricesAlternative() {
        try {
            // Using an alternative free API
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=gold,silver&vs_currencies=usd');
            const data = await response.json();
            
            // Extract gold and silver prices (in USD per ounce)
            const goldPriceUSD = data.gold?.usd || 0;
            const silverPriceUSD = data.silver?.usd || 0;
            
            // Convert from USD per ounce to BDT per gram
            const usdToBDT = 110; // Example conversion rate
            
            if (goldPriceUSD > 0) {
                goldPricePerGram = (goldPriceUSD / 31.1035) * usdToBDT;
            }
            
            if (silverPriceUSD > 0) {
                silverPricePerGram = (silverPriceUSD / 31.1035) * usdToBDT;
            }
            
            console.log(`Current gold price (alternative): ${goldPricePerGram.toFixed(2)} BDT/gram`);
            console.log(`Current silver price (alternative): ${silverPricePerGram.toFixed(2)} BDT/gram`);
            
            // Update calculation with new prices
            calculateZakat();
            
        } catch (error) {
            console.error('Error fetching alternative metal prices:', error);
            // Use default values if both APIs fail
            calculateZakat();
        }
    }
    
    // Function to calculate Zakat
    function calculateZakat() {
        // Get values from inputs, convert to numbers and handle empty inputs
        const goldValue = parseFloat(goldInput.value) || 0;
        const silverValue = parseFloat(silverInput.value) || 0;
        const cashValue = parseFloat(cashInput.value) || 0;
        const savingsValue = parseFloat(savingsInput.value) || 0;
        const businessBankValue = parseFloat(businessBankInput.value) || 0;
        const insuranceValue = parseFloat(insuranceInput.value) || 0;
        const realEstateValue = parseFloat(realEstateInput.value) || 0;
        const merchandiseValue = parseFloat(merchandiseInput.value) || 0;
        const stocksValue = parseFloat(stocksInput.value) || 0;
        const liabilitiesValue = parseFloat(liabilitiesInput.value) || 0;
        
        // Calculate total assets
        const totalAssets = goldValue + silverValue + cashValue + savingsValue + 
                           businessBankValue + insuranceValue + realEstateValue + 
                           merchandiseValue + stocksValue;
        
        // Calculate net assets (total assets minus liabilities)
        const netAssets = totalAssets - liabilitiesValue;
        
        // Calculate nisab threshold (using the lower of gold and silver nisab)
        const goldNisabValue = goldNisabGrams * goldPricePerGram;
        const silverNisabValue = silverNisabGrams * silverPricePerGram;
        const nisabThreshold = Math.min(goldNisabValue, silverNisabValue);
        
        // Calculate Zakat (only if net assets exceed nisab threshold)
        let zakatAmount = 0;
        if (netAssets >= nisabThreshold) {
            zakatAmount = netAssets * zakatRate;
        }
        
        // Update the display
        if (totalAssetsElement) {
            totalAssetsElement.textContent = `Total Assets: ${netAssets.toFixed(2)} ৳`;
        }
        
        if (payZakatElement) {
            payZakatElement.textContent = `Pay Zakat: ${zakatAmount.toFixed(2)} ৳`;
        }
        
        // Display nisab threshold information (optional)
        console.log(`Nisab threshold: ${nisabThreshold.toFixed(2)} BDT`);
        console.log(`Net assets: ${netAssets.toFixed(2)} BDT`);
        console.log(`Zakat amount: ${zakatAmount.toFixed(2)} BDT`);
        
        // Return the calculated values (useful for testing or extending functionality)
        return {
            totalAssets: totalAssets,
            netAssets: netAssets,
            nisabThreshold: nisabThreshold,
            zakatAmount: zakatAmount
        };
    }
    
    // Add event listener to the calculate button
    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            // Try to fetch current prices when calculate is clicked
            fetchMetalPrices().catch(() => fetchMetalPricesAlternative());
        });
    }
    
    // Add event listeners to all input fields for real-time calculation (optional)
    const allInputs = [
        goldInput, silverInput, cashInput, savingsInput, businessBankInput,
        insuranceInput, realEstateInput, merchandiseInput, stocksInput, liabilitiesInput
    ];
    
    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                // Optional: Uncomment the line below for real-time calculation
                // calculateZakat();
            });
        }
    });
    
    // Initialize by fetching current metal prices
    fetchMetalPrices().catch(() => fetchMetalPricesAlternative());
});
