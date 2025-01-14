const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// LinkedIn Data for the last 14 days (grouped by week)
const statsData = [
    { date: '12/27/2024', impressions: { organic: 256, sponsored: 0 }, clicks: { organic: 6, sponsored: 0 }, reactions: 6, comments: 0, engagementRate: 0.046875, shares: 0 },
    { date: '12/28/2024', impressions: { organic: 164, sponsored: 0 }, clicks: { organic: 15, sponsored: 0 }, reactions: 0, comments: 0, engagementRate: 0.091463415, shares: 0 },
    { date: '12/29/2024', impressions: { organic: 144, sponsored: 0 }, clicks: { organic: 1, sponsored: 0 }, reactions: -2, comments: 0, engagementRate: -0.006944444, shares: 0 },
    { date: '12/30/2024', impressions: { organic: 206, sponsored: 0 }, clicks: { organic: 11, sponsored: 0 }, reactions: 2, comments: 0, engagementRate: 0.063106796, shares: 0 },
    { date: '12/31/2024', impressions: { organic: 210, sponsored: 0 }, clicks: { organic: 11, sponsored: 0 }, reactions: 3, comments: 0, engagementRate: 0.066666667, shares: 0 },
    { date: '01/01/2025', impressions: { organic: 127, sponsored: 0 }, clicks: { organic: 3, sponsored: 0 }, reactions: 3, comments: 0, engagementRate: 0.047244094, shares: 0 },
    { date: '01/02/2025', impressions: { organic: 330, sponsored: 0 }, clicks: { organic: 6, sponsored: 0 }, reactions: 8, comments: 0, engagementRate: 0.042424242, shares: 0 },
    { date: '01/03/2025', impressions: { organic: 336, sponsored: 0 }, clicks: { organic: 16, sponsored: 0 }, reactions: 9, comments: 0, engagementRate: 0.077380952, shares: 1 },
    { date: '01/04/2025', impressions: { organic: 120, sponsored: 0 }, clicks: { organic: 9, sponsored: 0 }, reactions: 0, comments: 0, engagementRate: 0.075, shares: 0 },
    { date: '01/05/2025', impressions: { organic: 198, sponsored: 0 }, clicks: { organic: 4, sponsored: 0 }, reactions: 1, comments: 0, engagementRate: 0.025252525, shares: 0 },
    { date: '01/06/2025', impressions: { organic: 166, sponsored: 0 }, clicks: { organic: 4, sponsored: 0 }, reactions: 4, comments: 0, engagementRate: 0.048192771, shares: 0 },
    { date: '01/07/2025', impressions: { organic: 236, sponsored: 0 }, clicks: { organic: 11, sponsored: 0 }, reactions: 4, comments: 0, engagementRate: 0.063559322, shares: 0 },
    { date: '01/08/2025', impressions: { organic: 194, sponsored: 0 }, clicks: { organic: 21, sponsored: 0 }, reactions: 3, comments: 0, engagementRate: 0.12371134, shares: 0 },
    { date: '01/09/2025', impressions: { organic: 374, sponsored: 0 }, clicks: { organic: 20, sponsored: 0 }, reactions: 19, comments: 0, engagementRate: 0.104278075, shares: 0 },
    { date: '01/10/2025', impressions: { organic: 421, sponsored: 0 }, clicks: { organic: 16, sponsored: 0 }, reactions: 16, comments: 0, engagementRate: 0.078384798, shares: 1 }
];



// Competitor Data from 09/21/2024 to 10/05/2024

const competitorsData = [
    { name: "WEKO", followers: 1609, newFollowers: 15, interactions: 53, posts: 9 },
    { name: "Sellmore GmbH", followers: 1099, newFollowers: 14, interactions: 40, posts: 3 },
    { name: "isales GmbH", followers: 638, newFollowers: 9, interactions: 10, posts: 0 },
    { name: "CompData Computer GmbH", followers: 907, newFollowers: 17, interactions: 59, posts: 3 },
    { name: "System AG@data GmbH", followers: 1001, newFollowers: 7, interactions: 29, posts: 1 },
    { name: "DPS Business Solutions", followers: 2618, newFollowers: 95, interactions: 78, posts: 3 },
    { name: "Datatronic Software AG", followers: 1461, newFollowers: 5, interactions: 102, posts: 6 }
];



// Website Analytics Data for 90 Days in Weekly Increments
const startDate = new Date('2024-07-23');
const weeklyIncrements = Array.from({ length: 14 }, (_, i) => {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i * 7);  // Add 7 days for each week
    return currentDate.toISOString().slice(0, 10);  // Format as YYYY-MM-DD
});

const websiteData = {
    activeUsers: [
        236, 354, 355, 381, // Data before 2024-10-16
        1530, // Week starting 2024-10-16
        2080, // Week starting 2024-10-23
        1417, // Week starting 2024-10-30
        1328, // Week starting 2024-11-06
        356,  // Week starting 2024-11-13
        483,  // Week starting 2024-11-20
        539,  // Week starting 2024-11-27
        549,  // Week starting 2024-12-04
        483,  // Week starting 2024-12-11
        539,  // Week starting 2024-12-18
        549,  // Week starting 2024-12-25
        483,  // Week starting 2025-01-01
        539   // Week starting 2025-01-08
    ],
    newUsers: [
        189, 238, 264, 248, // Data before 2024-10-16
        1362, // Week starting 2024-10-16
        1298, // Week starting 2024-10-23
        991,  // Week starting 2024-10-30
        876,  // Week starting 2024-11-06
        276,  // Week starting 2024-11-13
        254,  // Week starting 2024-11-20
        18,   // Week starting 2024-11-27
        18,   // Week starting 2024-12-04
        254,  // Week starting 2024-12-11
        18,   // Week starting 2024-12-18
        18,   // Week starting 2024-12-25
        254,  // Week starting 2025-01-01
        18    // Week starting 2025-01-08
    ],
    weeklyIncrements: [
        "2024-09-23", "2024-09-30", "2024-10-07", "2024-10-14", // Before 2024-10-16
        "2024-10-16", "2024-10-23", "2024-10-30", "2024-11-06", // Weeks with new data
        "2024-11-13", "2024-11-20", "2024-11-27", "2024-12-04", 
        "2024-12-11", "2024-12-18", "2024-12-25", "2025-01-01", "2025-01-08" // Final weeks
    ],

    averageEngagementTime: [], // Retain or update if needed
    userSources: {
        direct: 2301,
        organicSearch: 1086,
        paidSearch: 523,
        referral: 271,
    },
    activeUsersByCountry: {
        Desktop: 1800,
        Mobile: 549,
        Tablet: 244
    },
    pageViews: {
        '/': 7137,
        '/login': 1456,
        '/dashboard/discover': 760,
        '/sagehrsuite/': 736,
        '/dienstleistungen/webinare/': 721,
        '/profile/overview': 639,
        '/vereinscampus/': 625,
        '/sage100/': 454,
        '/unternehmen/': 424,
        '/dienstleistungen/webinare/vereinscampus/': 394,
        '/shop/': 382,
        '/dashboard/my-courses': 344,
        
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
