const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// LinkedIn Data for the last 14 days (grouped by week)
const statsData = [
    { date: '10/07/2024', impressions: { organic: 350, sponsored: 0 }, clicks: { organic: 12, sponsored: 0 }, reactions: 19, comments: 0, engagementRate: 0.088571429 },
    { date: '10/08/2024', impressions: { organic: 699, sponsored: 0 }, clicks: { organic: 36, sponsored: 0 }, reactions: 32, comments: 2, engagementRate: 0.100143062 },
    { date: '10/09/2024', impressions: { organic: 641, sponsored: 0 }, clicks: { organic: 42, sponsored: 0 }, reactions: 28, comments: 3, engagementRate: 0.11700468 },
    { date: '10/10/2024', impressions: { organic: 703, sponsored: 0 }, clicks: { organic: 30, sponsored: 0 }, reactions: 27, comments: 1, engagementRate: 0.086770982 },
    { date: '10/11/2024', impressions: { organic: 280, sponsored: 0 }, clicks: { organic: 12, sponsored: 0 }, reactions: 7, comments: 0, engagementRate: 0.071428571 },
    { date: '10/12/2024', impressions: { organic: 148, sponsored: 0 }, clicks: { organic: 7, sponsored: 0 }, reactions: 4, comments: 0, engagementRate: 0.074324324 },
    { date: '10/13/2024', impressions: { organic: 251, sponsored: 0 }, clicks: { organic: 21, sponsored: 0 }, reactions: 5, comments: 0, engagementRate: 0.107569721 },
    { date: '10/14/2024', impressions: { organic: 430, sponsored: 0 }, clicks: { organic: 41, sponsored: 0 }, reactions: 24, comments: 4, engagementRate: 0.160465116 },
    { date: '11/09/2024', impressions: { organic: 68, sponsored: 125 }, clicks: { organic: 3, sponsored: 0 }, reactions: 2, comments: 0, engagementRate: 0.025906736 },
    { date: '11/10/2024', impressions: { organic: 156, sponsored: 303 }, clicks: { organic: 6, sponsored: 1 }, reactions: 1, comments: 0, engagementRate: 0.017429194 },
    { date: '11/11/2024', impressions: { organic: 390, sponsored: 55 }, clicks: { organic: 11, sponsored: 0 }, reactions: 14, comments: 0, engagementRate: 0.060674157 },
    { date: '11/12/2024', impressions: { organic: 1362, sponsored: 0 }, clicks: { organic: 325, sponsored: 0 }, reactions: 27, comments: 3, engagementRate: 0.260646109 },
    { date: '11/13/2024', impressions: { organic: 913, sponsored: 0 }, clicks: { organic: 130, sponsored: 0 }, reactions: 28, comments: 3, engagementRate: 0.177437021 },
    { date: '11/14/2024', impressions: { organic: 458, sponsored: 0 }, clicks: { organic: 57, sponsored: 0 }, reactions: 15, comments: 1, engagementRate: 0.159388646 },
    { date: '11/15/2024', impressions: { organic: 264, sponsored: 0 }, clicks: { organic: 21, sponsored: 0 }, reactions: 7, comments: 0, engagementRate: 0.106060606 }
];



// Competitor Data from 09/21/2024 to 10/05/2024

const competitorsData = [
    { name: "WEKO", followers: 1573, newFollowers: 21, interactions: 34, posts: 10 },
    { name: "Sellmore GmbH", followers: 1069, newFollowers: 13, interactions: 59, posts: 5 },
    { name: "isales GmbH", followers: 609, newFollowers: 14, interactions: 47, posts: 2 },
    { name: "CompData Computer GmbH", followers: 818, newFollowers: 30, interactions: 149, posts: 3 },
    { name: "System AG@data GmbH", followers: 975, newFollowers: 7, interactions: 55, posts: 5 },
    { name: "DPS Business Solutions", followers: 2332, newFollowers: 62, interactions: 188, posts: 7 },
    { name: "Datatronic Software AG", followers: 1448, newFollowers: 7, interactions: 122, posts: 23 }
];

// Website Analytics Data for 90 Days in Weekly Increments
const startDate = new Date('2024-07-23');
const weeklyIncrements = Array.from({ length: 14 }, (_, i) => {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i * 7);  // Add 7 days for each week
    return currentDate.toISOString().slice(0, 10);  // Format as YYYY-MM-DD
});

const websiteData = {
    activeUsers: [157, 199, 248, 266, 399, 230, 351, 347, 370, 398, 426, 475, 446, 10],
    newUsers: [118, 161, 203, 228, 333, 189, 264, 238, 248, 297, 317, 298, 261, 8],
    weeklyIncrements: ["2024-08-27", "2024-09-03", "2024-09-10", "2024-09-17", "2024-09-24", "2024-10-01", "2024-10-08", "2024-10-15", "2024-10-22", "2024-10-29", "2024-11-05", "2024-11-12", "2024-11-19", "2024-11-24"], // Weekly starting dates
    averageEngagementTime: [/* retain or add new values as needed */],
    userSources: {
        direct: 794,
        organicSearch: 344,
        paidSearch: 187,
        referral: 105,
        organicSocial: 94
    },
    activeUsersByCountry: {
        DE: 1339,
        IN: 49,
        AT: 18,
        IE: 18,
        ID: 14,
        GR: 9,
        CH: 8
    },
    pageViews: {
        'Business Software | für ERP, HR, IT Betr. und Cloud-Hosting': 999,
        'SageMee: Sage Online - Learnplattform': 847,
        'DPS|BS Campus ▶ All in one Lernplattform': 595,
        'SAGE HR SUITE - SageMee': 573,
        'DPS|BS Campus': 513,
        'Vereinscampus - DPS Business Solutions': 454,
        'SAGE 100 - SageMee': 353,
        'Webinar: Vereinsthemen abbilden und Sponsoren gewinnen': 336,
        'Webinare - DPS Business Solutions': 317,
        'Anmelden - DPS|BS Campus': 276,
        'Entdecken - DPS|BS Campus': 167
    }
};

// Helper function to calculate weekly totals
function calculateWeeklyTotals(data) {
    const week1 = data.slice(0, 7).reduce((acc, day) => {
        acc.reactions += day.reactions;
        acc.comments += day.comments;
        acc.shares += day.shares;
        return acc;
    }, {
        
        reactions: 0, comments: 0, shares: 0
    });

    const week2 = data.slice(7).reduce((acc, day) => {
        acc.reactions += day.reactions;
        acc.comments += day.comments;
        acc.shares += day.shares;
        return acc;
    }, {
        reactions: 0, comments: 0, shares: 0
    });

    return { week1, week2 };
}

// Follower data from the backend
const followerData = [
    { date: '07/24/2024', followers: 2 },
    { date: '07/25/2024', followers: 7 },
    { date: '07/26/2024', followers: 1 },
    { date: '07/27/2024', followers: 3 },
    { date: '07/28/2024', followers: 1 },
    { date: '07/29/2024', followers: 5 },
    { date: '07/30/2024', followers: 3 },
    { date: '07/31/2024', followers: 7 },
    { date: '08/01/2024', followers: 4 },
    { date: '08/02/2024', followers: 3 },
    { date: '08/03/2024', followers: 5 },
    { date: '08/04/2024', followers: 5 },
    { date: '08/05/2024', followers: 5 },
    { date: '08/06/2024', followers: 3 },
    { date: '08/07/2024', followers: 4 },
    { date: '08/08/2024', followers: 6 },
    { date: '08/09/2024', followers: 2 },
    { date: '08/10/2024', followers: 4 },
    { date: '08/11/2024', followers: 5 },
    { date: '08/12/2024', followers: 3 },
    { date: '08/13/2024', followers: 4 },
    { date: '08/14/2024', followers: 6 },
    { date: '08/15/2024', followers: 3 },
    { date: '08/16/2024', followers: 5 },
    { date: '08/17/2024', followers: 2 },
    { date: '08/18/2024', followers: 7 },
    { date: '08/19/2024', followers: 4 },
    { date: '08/20/2024', followers: 6 },
    { date: '08/21/2024', followers: 5 },
    { date: '08/22/2024', followers: 2 },
    { date: '08/23/2024', followers: 3 },
    { date: '08/24/2024', followers: 5 },
    { date: '08/25/2024', followers: 6 },
    { date: '08/26/2024', followers: 4 },
    { date: '08/27/2024', followers: 2 },
    { date: '08/28/2024', followers: 3 },
    { date: '08/29/2024', followers: 4 },
    { date: '08/30/2024', followers: 6 },
    { date: '08/31/2024', followers: 5 },
    { date: '09/01/2024', followers: 3 },
    { date: '09/02/2024', followers: 4 },
    { date: '09/03/2024', followers: 5 },
    { date: '09/04/2024', followers: 6 },
    { date: '09/05/2024', followers: 4 },
    { date: '09/06/2024', followers: 3 },
    { date: '09/07/2024', followers: 5 },
    { date: '09/08/2024', followers: 7 },
    { date: '09/09/2024', followers: 4 },
    { date: '09/10/2024', followers: 6 },
    { date: '09/11/2024', followers: 3 },
    { date: '09/12/2024', followers: 5 },
    { date: '09/13/2024', followers: 6 },
    { date: '09/14/2024', followers: 4 },
    { date: '09/15/2024', followers: 2 },
    { date: '09/16/2024', followers: 5 },
    { date: '09/17/2024', followers: 6 },
    { date: '09/18/2024', followers: 4 },
    { date: '09/19/2024', followers: 3 },
    { date: '09/20/2024', followers: 7 },
    { date: '09/21/2024', followers: 6 },
    { date: '09/22/2024', followers: 4 },
    { date: '09/23/2024', followers: 5 },
    { date: '09/24/2024', followers: 3 },
    { date: '09/25/2024', followers: 4 },
    { date: '09/26/2024', followers: 7 },
    { date: '09/27/2024', followers: 5 },
    { date: '09/28/2024', followers: 3 },
    { date: '09/29/2024', followers: 6 },
    { date: '09/30/2024', followers: 5 },
    { date: '10/01/2024', followers: 4 },
    { date: '10/02/2024', followers: 7 },
    { date: '10/03/2024', followers: 6 },
    { date: '10/04/2024', followers: 4 },
    { date: '10/05/2024', followers: 5 },
    { date: '10/06/2024', followers: 7 },
    { date: '10/07/2024', followers: 3 },
    { date: '10/08/2024', followers: 5 },
    { date: '10/09/2024', followers: 4 },
    { date: '10/10/2024', followers: 6 },
    { date: '10/11/2024', followers: 7 },
    { date: '10/12/2024', followers: 4 },
    { date: '10/13/2024', followers: 5 },
    { date: '10/14/2024', followers: 6 },
    { date: '10/15/2024', followers: 3 },
    { date: '10/16/2024', followers: 4 },
    { date: '10/17/2024', followers: 7 },
    { date: '10/18/2024', followers: 5 },
    { date: '10/19/2024', followers: 3 },
    { date: '10/20/2024', followers: 7 },
    { date: '10/21/2024', followers: 4 },
    { date: '10/22/2024', followers: 6 },
    { date: '10/23/2024', followers: 5 },
];

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
        websiteData,  // Pass website analytics data to the frontend
        weeklyTotals,
        percentageChanges,
        followerData // Pass follower data to the frontend
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
