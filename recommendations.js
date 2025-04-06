document.addEventListener('DOMContentLoaded', function() {
    const farmerData = JSON.parse(localStorage.getItem('farmerData'));
    
    if (!farmerData) {
        window.location.href = 'farmer-profile.html';
        return;
    }

    // Generate recommendations based on farmer data
    generateRecommendations(farmerData);
});

// Add this at the beginning of your recommendations.js file
async function loadCSVData() {
    try {
        const farmerAdvisorResponse = await fetch('c:/Users/hp/Downloads/Accenture_gdg/Accenture_gdg/data/farmer_advisor_dataset.csv');
        const marketResearchResponse = await fetch('c:/Users/hp/Downloads/Accenture_gdg/Accenture_gdg/data/market_research_dataset.csv');
        
        const farmerAdvisorData = await farmerAdvisorResponse.text();
        const marketResearchData = await marketResearchResponse.text();

        return {
            advisorData: parseCSV(farmerAdvisorData),
            marketData: parseCSV(marketResearchData)
        };
    } catch (error) {
        console.error('Error loading CSV data:', error);
        return null;
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const entry = {};
            headers.forEach((header, index) => {
                entry[header.trim()] = values[index].trim();
            });
            data.push(entry);
        }
    }

    return data;
}

// Modify your existing generateRecommendations function
async function generateRecommendations(formData) {
    const csvData = await loadCSVData();
    if (!csvData) {
        showError('Failed to load recommendations data');
        return;
    }

    // Use the CSV data for recommendations
    const recommendations = {
        crops: getCropRecommendations(formData, csvData.advisorData),
        practices: getFarmingPractices(formData, csvData.advisorData),
        resources: getResourceManagement(formData, csvData.advisorData),
        financial: getFinancialInsights(formData, csvData.marketData),
        market: getMarketInsights(formData, csvData.marketData)
    };

    // Update UI
    updateRecommendationsUI(recommendations);
}

function updateRecommendationsUI(recommendations) {
    document.getElementById('cropList').innerHTML = generateHTML(recommendations.crops);
    document.getElementById('practicesList').innerHTML = generateHTML(recommendations.practices);
    document.getElementById('resourcesList').innerHTML = generateHTML(recommendations.resources);
    document.getElementById('financialList').innerHTML = generateHTML(recommendations.financial);
    document.getElementById('marketList').innerHTML = generateHTML(recommendations.market);
}

function showError(message) {
    const elements = document.querySelectorAll('.recommendation-content');
    elements.forEach(element => {
        element.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    });
}

function getCropRecommendations(data, advisorData) {
    const recommendations = [];
    
    // Filter suitable crops based on environmental conditions
    const suitableCrops = advisorData.filter(crop => {
        const soilConditionMatch = Math.abs(parseFloat(crop.Soil_pH) - parseFloat(data.soilPH)) <= 1;
        const moistureMatch = parseFloat(crop.Soil_Moisture) >= parseFloat(data.minMoisture);
        return soilConditionMatch && moistureMatch;
    });

    suitableCrops.forEach(crop => {
        recommendations.push({
            title: `${crop.Crop_Type} Recommendations`,
            items: [
                `Expected Yield: ${crop.Crop_Yield_ton} tons per acre`,
                `Sustainability Score: ${crop.Sustainability_Score}`,
                `Required Temperature: ${crop.Temperature_C}°C`,
                `Rainfall Requirement: ${crop.Rainfall_mm}mm`
            ]
        });
    });

    return recommendations;
}

function getFarmingPractices(data, advisorData) {
    const practices = [];
    
    const cropData = advisorData.find(crop => 
        crop.Crop_Type.toLowerCase() === data.preferredCrop.toLowerCase()
    );

    if (cropData) {
        practices.push({
            title: 'Resource Management',
            items: [
                `Recommended Fertilizer Usage: ${cropData.Fertilizer_Usage_kg}kg per acre`,
                `Optimal Pesticide Usage: ${cropData.Pesticide_Usage_kg}kg per acre`,
                `Required Soil pH: ${cropData.Soil_pH}`,
                `Optimal Soil Moisture: ${cropData.Soil_Moisture}%`
            ]
        });
    }

    return practices;
}

function getFinancialInsights(data, marketData) {
    const insights = [];
    
    const marketInfo = marketData.filter(market => 
        market.Product.toLowerCase() === data.preferredCrop.toLowerCase()
    );

    marketInfo.forEach(market => {
        insights.push({
            title: 'Market Analysis',
            items: [
                `Current Market Price: ₹${market.Market_Price_per_ton}/ton`,
                `Competitor Price: ₹${market.Competitor_Price_per_ton}/ton`,
                `Demand Index: ${market.Demand_Index}/10`,
                `Economic Indicator: ${market.Economic_Indicator}`
            ]
        });
    });

    return insights;
}

function getMarketInsights(data, marketData) {
    const insights = [];
    
    const marketTrends = marketData.filter(market => 
        market.Product.toLowerCase() === data.preferredCrop.toLowerCase()
    );

    marketTrends.forEach(market => {
        insights.push({
            title: 'Market Trends',
            items: [
                `Supply Index: ${market.Supply_Index}/10`,
                `Weather Impact: ${market.Weather_Impact_Score}/10`,
                `Seasonal Factor: ${market.Seasonal_Factor}`,
                `Consumer Trend: ${market.Consumer_Trend_Index}/10`
            ]
        });
    });

    return insights;
}

// Update the generateHTML function to handle the new structured format
function generateHTML(sections) {
    if (!sections.length) return '<p>No specific recommendations available.</p>';
    
    return sections.map(section => `
        <div class="recommendation-section">
            <h3>${section.title}</h3>
            <ul>
                ${section.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}