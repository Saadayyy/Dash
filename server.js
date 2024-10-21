const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// LinkedIn Data for the last 14 days (grouped by week)
const statsData = [
    { date: '09/21/2024', impressions: { organic: 178, sponsored: 6950 }, clicks: { organic: 3, sponsored: 41 }, reactions: 10, comments: 0, shares: 0, engagementRate: 0.00701459 },
    { date: '09/22/2024', impressions: { organic: 302, sponsored: 6161 }, clicks: { organic: 13, sponsored: 38 }, reactions: 25, comments: 0, shares: 0, engagementRate: 0.011913972 },
    { date: '09/23/2024', impressions: { organic: 1387, sponsored: 3331 }, clicks: { organic: 95, sponsored: 20 }, reactions: 67, comments: 5, shares: 1, engagementRate: 0.040059347 },
    { date: '09/24/2024', impressions: { organic: 796, sponsored: 4156 }, clicks: { organic: 44, sponsored: 30 }, reactions: 28, comments: 2, shares: 5, engagementRate: 0.020799677 },
    { date: '09/25/2024', impressions: { organic: 447, sponsored: 675 }, clicks: { organic: 19, sponsored: 10 }, reactions: 8, comments: 0, shares: 0, engagementRate: 0.032976827 },
    { date: '09/26/2024', impressions: { organic: 311, sponsored: 158 }, clicks: { organic: 15, sponsored: 1 }, reactions: 49, comments: 4, shares: 3, engagementRate: 0.078891258 }, // Fixed negative values
    { date: '09/27/2024', impressions: { organic: 581, sponsored: 0 }, clicks: { organic: 16, sponsored: 0 }, reactions: 22, comments: 0, shares: 2, engagementRate: 0.067125645 },
    { date: '09/28/2024', impressions: { organic: 261, sponsored: 0 }, clicks: { organic: 2, sponsored: 0 }, reactions: 4, comments: 0, shares: 0, engagementRate: 0.026819923 },
    { date: '09/29/2024', impressions: { organic: 211, sponsored: 0 }, clicks: { organic: 10, sponsored: 0 }, reactions: 3, comments: 0, shares: 0, engagementRate: 0.061611374 },
    { date: '09/30/2024', impressions: { organic: 680, sponsored: 0 }, clicks: { organic: 18, sponsored: 0 }, reactions: 20, comments: 1, shares: 1, engagementRate: 0.060294118 },
    { date: '10/01/2024', impressions: { organic: 273, sponsored: 0 }, clicks: { organic: 5, sponsored: 0 }, reactions: 10, comments: 0, shares: 2, engagementRate: 0.054945055 },
    { date: '10/02/2024', impressions: { organic: 251, sponsored: 0 }, clicks: { organic: 11, sponsored: 0 }, reactions: 4, comments: 0, shares: 1, engagementRate: 0.051792829 },
    { date: '10/03/2024', impressions: { organic: 115, sponsored: 0 }, clicks: { organic: 7, sponsored: 0 }, reactions: 1, comments: 0, shares: 1, engagementRate: 0.069565217 },
    { date: '10/04/2024', impressions: { organic: 124, sponsored: 0 }, clicks: { organic: 3, sponsored: 0 }, reactions: 1, comments: 0, shares: 2, engagementRate: 0.032258065 },
    { date: '10/05/2024', impressions: { organic: 103, sponsored: 0 }, clicks: { organic: 4, sponsored: 0 }, reactions: 2, comments: 0, shares: 0, engagementRate: 0.058252427 }
];

// Competitor Data from 09/21/2024 to 10/05/2024
const competitorsData = [
    { name: "WEKO", followers: 1490, newFollowers: 21, interactions: 74, posts: 11 },
    { name: "Sellmore GmbH", followers: 1007, newFollowers: 21, interactions: 65, posts: 3 },
    { name: "isales GmbH", followers: 558, newFollowers: 9, interactions: 104, posts: 2 },
    { name: "CompData Computer GmbH", followers: 712, newFollowers: 62, interactions: 118, posts: 5 },
    { name: "DPS Business Solutions", followers: 2072, newFollowers: 122, interactions: 163, posts: 5 },
    { name: "Datatronic Software AG", followers: 1429, newFollowers: 9, interactions: 195, posts: 14 }
];

// Website Analytics Data for 90 Days in Weekly Increments
const startDate = new Date('2024-07-23');
const weeklyIncrements = Array.from({ length: 14 }, (_, i) => {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i * 7);  // Add 7 days for each week
    return currentDate.toISOString().slice(0, 10);  // Format as YYYY-MM-DD
});

const websiteData = {
    activeUsers: [64, 159, 210, 186, 182, 188, 199, 248, 266, 399, 230, 351, 347, 8],
    newUsers: [64, 157, 189, 157, 137, 145, 161, 203, 228, 333, 189, 264, 238, 6],
    weeklyIncrements: weeklyIncrements,  // Include the calculated weekly dates
    averageEngagementTime: [/* same as before */],
    userSources: {
        direct: 442,
        organicSearch: 282,
        paidSearch: 169,
        referral: 75,
        organicSocial: 43
    },
    activeUsersByCountry: {
        DE: 992,
        AT: 16,
        IE: 12,
        IN: 11,
        CH: 8,
        ID: 8,
        ES: 7
    },
    pageViews: {
        'Business Software | für ERP, HR, IT Betr. und Cloud-Hosting': 888,
        'DPS|BS Campus ▶ All in one Lernplattform': 444,
        'DPS|BS Campus': 422,
        'Anmelden - DPS|BS Campus': 358,
        'Webinare - DPS Business Solutions': 271,
        'Entdecken - DPS|BS Campus': 182,
        'IT Systemhaus | Ihr Ansprechpartner für Software und IT': 131,
        'Mein Profil - DPS|BS Campus': 125,
        'Wie eine effektive Unternehmensstruktur Ihr Geschäft vorantreibt': 113,
        'Blog - DPS Business Solutions': 109,
        'Meine Kurse - DPS|BS Campus': 102,
        'Referenzen aus den unterschiedlichsten Branchen': 87,
        'Vereinscampus - DPS Business Solutions': 87,
        '- - DPS|BS Campus': 82,
        'Sage HR Suite | Integrierte Personalsoftware': 77
    }
};

// Helper function to calculate weekly totals
function calculateWeeklyTotals(data) {
    const week1 = data.slice(0, 7).reduce((acc, day) => {
        acc.impressions.organic += day.impressions.organic;
        acc.impressions.sponsored += day.impressions.sponsored;
        acc.clicks.organic += day.clicks.organic;
        acc.clicks.sponsored += day.clicks.sponsored;
        acc.reactions += day.reactions;
        acc.comments += day.comments;
        acc.shares += day.shares;
        return acc;
    }, {
        impressions: { organic: 0, sponsored: 0 },
        clicks: { organic: 0, sponsored: 0 },
        reactions: 0, comments: 0, shares: 0
    });

    const week2 = data.slice(7).reduce((acc, day) => {
        acc.impressions.organic += day.impressions.organic;
        acc.impressions.sponsored += day.impressions.sponsored;
        acc.clicks.organic += day.clicks.organic;
        acc.clicks.sponsored += day.clicks.sponsored;
        acc.reactions += day.reactions;
        acc.comments += day.comments;
        acc.shares += day.shares;
        return acc;
    }, {
        impressions: { organic: 0, sponsored: 0 },
        clicks: { organic: 0, sponsored: 0 },
        reactions: 0, comments: 0, shares: 0
    });

    return { week1, week2 };
}

// Function to calculate percentage change between weeks
function calculatePercentageChange(current, previous) {
    return previous === 0 ? 0 : ((current - previous) / previous) * 100;
}

// Calculate weekly totals
const weeklyTotals = calculateWeeklyTotals(statsData);

// Calculate percentage changes
const percentageChanges = {
    reactions: calculatePercentageChange(weeklyTotals.week2.reactions, weeklyTotals.week1.reactions),
    comments: calculatePercentageChange(weeklyTotals.week2.comments, weeklyTotals.week1.comments),
    shares: calculatePercentageChange(weeklyTotals.week2.shares, weeklyTotals.week1.shares)
};

// Route to serve the LinkedIn and website dashboard
app.get('/', (req, res) => {
    res.render('dashboard', {
        statsData,
        competitorsData,
        websiteData, // Pass website analytics data to the frontend
        weeklyTotals,
        percentageChanges
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
