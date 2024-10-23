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
    { date: '10/15/2024', impressions: { organic: 982, sponsored: 0 }, clicks: { organic: 46, sponsored: 0 }, reactions: 28, comments: 7, engagementRate: 0.083503055 },
    { date: '10/16/2024', impressions: { organic: 395, sponsored: 0 }, clicks: { organic: 13, sponsored: 0 }, reactions: 15, comments: 0, engagementRate: 0.070886076 },
    { date: '10/17/2024', impressions: { organic: 537, sponsored: 0 }, clicks: { organic: 31, sponsored: 0 }, reactions: 23, comments: 2, engagementRate: 0.106145251 },
    { date: '10/18/2024', impressions: { organic: 693, sponsored: 0 }, clicks: { organic: 41, sponsored: 0 }, reactions: 31, comments: 2, engagementRate: 0.106782107 },
    { date: '10/19/2024', impressions: { organic: 203, sponsored: 0 }, clicks: { organic: 13, sponsored: 0 }, reactions: 4, comments: 1, engagementRate: 0.088669951 },
    { date: '10/20/2024', impressions: { organic: 172, sponsored: 2156 }, clicks: { organic: 8, sponsored: 1 }, reactions: 9, comments: 1, engagementRate: 0.008161512 },
    { date: '10/21/2024', impressions: { organic: 522, sponsored: 3049 }, clicks: { organic: 25, sponsored: 0 }, reactions: 17, comments: 0, engagementRate: 0.012041445 }
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
