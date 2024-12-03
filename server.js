const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// LinkedIn Data for the last 14 days (grouped by week)
const statsData = [
    { date: '11/17/2024', impressions: { organic: 126, sponsored: 0 }, clicks: { organic: 9, sponsored: 0 }, reactions: 2, comments: 0, engagementRate: 0.087301587, shares: 0 },
    { date: '11/18/2024', impressions: { organic: 533, sponsored: 0 }, clicks: { organic: 44, sponsored: 0 }, reactions: 19, comments: 2, engagementRate: 0.123827392, shares: 1 },
    { date: '11/19/2024', impressions: { organic: 550, sponsored: 0 }, clicks: { organic: 162, sponsored: 0 }, reactions: 13, comments: 1, engagementRate: 0.32, shares: 0 },
    { date: '11/20/2024', impressions: { organic: 527, sponsored: 0 }, clicks: { organic: 116, sponsored: 0 }, reactions: 19, comments: 1, engagementRate: 0.258064516, shares: 0 },
    { date: '11/21/2024', impressions: { organic: 394, sponsored: 15 }, clicks: { organic: 48, sponsored: 1 }, reactions: 13, comments: 1, engagementRate: 0.15403423, shares: 0 },
    { date: '11/22/2024', impressions: { organic: 212, sponsored: 5 }, clicks: { organic: 14, sponsored: 0 }, reactions: 8, comments: -1, engagementRate: 0.096774194, shares: 0 },
    { date: '11/23/2024', impressions: { organic: 211, sponsored: 9 }, clicks: { organic: 2, sponsored: 0 }, reactions: 1, comments: 0, engagementRate: 0.013636364, shares: 0 },
    { date: '11/24/2024', impressions: { organic: 118, sponsored: 13 }, clicks: { organic: 30, sponsored: 0 }, reactions: 7, comments: 0, engagementRate: 0.282442748, shares: 0 },
    { date: '11/25/2024', impressions: { organic: 385, sponsored: 719 }, clicks: { organic: 14, sponsored: 3 }, reactions: 14, comments: 0, engagementRate: 0.02807971, shares: 0 },
    { date: '11/26/2024', impressions: { organic: 178, sponsored: 70 }, clicks: { organic: 27, sponsored: 0 }, reactions: 4, comments: 0, engagementRate: 0.125, shares: 0 },
    { date: '11/27/2024', impressions: { organic: 435, sponsored: 46 }, clicks: { organic: 28, sponsored: 0 }, reactions: 16, comments: 2, engagementRate: 0.097713098, shares: 1 },
    { date: '11/28/2024', impressions: { organic: 413, sponsored: 151 }, clicks: { organic: 24, sponsored: 1 }, reactions: 18, comments: 0, engagementRate: 0.078014184, shares: 1 },
    { date: '11/29/2024', impressions: { organic: 279, sponsored: 8 }, clicks: { organic: 12, sponsored: 0 }, reactions: 12, comments: 0, engagementRate: 0.087108014, shares: 1 },
    { date: '11/30/2024', impressions: { organic: 118, sponsored: 11 }, clicks: { organic: 9, sponsored: 0 }, reactions: 2, comments: 0, engagementRate: 0.085271318, shares: 0 },
    { date: '12/01/2024', impressions: { organic: 341, sponsored: 711 }, clicks: { organic: 36, sponsored: 3 }, reactions: 12, comments: 2, engagementRate: null, shares: 2 }
];


// Competitor Data from 09/21/2024 to 10/05/2024

const competitorsData = [
    { name: "WEKO", followers: 1580, newFollowers: 8, interactions: 18, posts: 11 },
    { name: "Sellmore GmbH", followers: 1073, newFollowers: 11, interactions: 95, posts: 4 },
    { name: "isales GmbH", followers: 615, newFollowers: 13, interactions: 54, posts: 3 },
    { name: "CompData Computer GmbH", followers: 836, newFollowers: 26, interactions: 147, posts: 4 },
    { name: "System AG@data GmbH", followers: 976, newFollowers: 2, interactions: 61, posts: 7 },
    { name: "DPS Business Solutions", followers: 2372, newFollowers: 61, interactions: 174, posts: 10 },
    { name: "Datatronic Software AG", followers: 1452, newFollowers: 6, interactions: 203, posts: 26 }
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
        Desktop: 1024,
        Mobile: 479,
        Tablet: 4
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
