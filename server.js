const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// LinkedIn Data for the last 14 days (grouped by week)
const statsData = [
    { date: '11/30/2024', impressions: { organic: 118, sponsored: 11 }, clicks: { organic: 9, sponsored: 0 }, reactions: 2, comments: 0, engagementRate: 0.085271318, shares: 0 },
    { date: '12/01/2024', impressions: { organic: 341, sponsored: 711 }, clicks: { organic: 36, sponsored: 3 }, reactions: 12, comments: 2, engagementRate: 0.052281369, shares: 2 },
    { date: '12/02/2024', impressions: { organic: 875, sponsored: 708 }, clicks: { organic: 175, sponsored: 4 }, reactions: 42, comments: 1, engagementRate: 0.141503474, shares: 2 },
    { date: '12/03/2024', impressions: { organic: 828, sponsored: 3738 }, clicks: { organic: 76, sponsored: 13 }, reactions: 45, comments: 1, engagementRate: 0.02978537, shares: 3 },
    { date: '12/04/2024', impressions: { organic: 579, sponsored: 1773 }, clicks: { organic: 25, sponsored: 11 }, reactions: 45, comments: 3, engagementRate: 0.034863946, shares: 1 },
    { date: '12/05/2024', impressions: { organic: 488, sponsored: 1098 }, clicks: { organic: 21, sponsored: 8 }, reactions: 32, comments: 0, engagementRate: 0.04035309, shares: 1 },
    { date: '12/06/2024', impressions: { organic: 607, sponsored: 412 }, clicks: { organic: 98, sponsored: 3 }, reactions: 31, comments: 0, engagementRate: 0.130520118, shares: 1 },
    { date: '12/07/2024', impressions: { organic: 305, sponsored: 398 }, clicks: { organic: 35, sponsored: 2 }, reactions: 12, comments: 0, engagementRate: 0.071123755, shares: 0 },
    { date: '12/08/2024', impressions: { organic: 411, sponsored: 355 }, clicks: { organic: 84, sponsored: 2 }, reactions: 14, comments: 0, engagementRate: 0.130548303, shares: 0 },
    { date: '12/09/2024', impressions: { organic: 743, sponsored: 144 }, clicks: { organic: 93, sponsored: 0 }, reactions: 24, comments: 1, engagementRate: 0.135287486, shares: 2 },
    { date: '12/10/2024', impressions: { organic: 660, sponsored: 168 }, clicks: { organic: 75, sponsored: 0 }, reactions: 29, comments: 0, engagementRate: 0.131642512, shares: 4 },
    { date: '12/11/2024', impressions: { organic: 444, sponsored: 144 }, clicks: { organic: 42, sponsored: 1 }, reactions: 23, comments: 0, engagementRate: 0.113945578, shares: 1 },
    { date: '12/12/2024', impressions: { organic: 392, sponsored: 87 }, clicks: { organic: 15, sponsored: 0 }, reactions: 34, comments: 1, engagementRate: 0.108559499, shares: 2 },
    { date: '12/13/2024', impressions: { organic: 554, sponsored: 34 }, clicks: { organic: 155, sponsored: 0 }, reactions: 51, comments: 4, engagementRate: 0.362244898, shares: 3 },
    { date: '12/14/2024', impressions: { organic: 326, sponsored: 19 }, clicks: { organic: 74, sponsored: 0 }, reactions: 19, comments: 0, engagementRate: 0.269565217, shares: 0 }
];


// Competitor Data from 09/21/2024 to 10/05/2024

const competitorsData = [
    { name: "WEKO", followers: 1588, newFollowers: 11, interactions: 37, posts: 11 },
    { name: "Sellmore GmbH", followers: 1079, newFollowers: 7, interactions: 111, posts: 5 },
    { name: "isales GmbH", followers: 619, newFollowers: 6, interactions: 11, posts: 0 },
    { name: "CompData Computer GmbH", followers: 862, newFollowers: 19, interactions: 104, posts: 4 },
    { name: "System AG@data GmbH", followers: 987, newFollowers: 11, interactions: 44, posts: 8 },
    { name: "DPS Business Solutions", followers: 2449, newFollowers: 103, interactions: 450, posts: 17 },
    { name: "Datatronic Software AG", followers: 1455, newFollowers: 8, interactions: 356, posts: 29 }
];


// Website Analytics Data for 90 Days in Weekly Increments
const startDate = new Date('2024-07-23');
const weeklyIncrements = Array.from({ length: 14 }, (_, i) => {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i * 7);  // Add 7 days for each week
    return currentDate.toISOString().slice(0, 10);  // Format as YYYY-MM-DD
});

const websiteData = {
    activeUsers: [404, 218, 236, 354, 355, 381, 408, 451, 460, 483, 539, 549, 32],
    newUsers: [333, 182, 189, 238, 264, 248, 297, 235, 261, 298, 276, 254, 18],
    weeklyIncrements: [
    "2024-09-23", "2024-09-30", "2024-10-07", "2024-10-14", "2024-10-21",
    "2024-10-28", "2024-11-04", "2024-11-11", "2024-11-18", "2024-11-25",
    "2024-12-02", "2024-12-09", "2024-12-15"
],
    averageEngagementTime: [], // Retain or update if needed
    userSources: {
        direct: 894,
        organicSearch: 385,
        paidSearch: 223,
        referral: 119,
        organicSocial: 38
    },
    activeUsersByCountry: {
        Desktop: 1348,
        Mobile: 297,
        Tablet: 18
    },
    pageViews: {
        'Homepage': 2502,
        '/login': 603,
        'sagehrsuite': 528,
        'sage100': 311,
        '/dashboard/discover/Courses': 280,
        '/profile/overview': 273,
        '/dienstleistungen/webinare/': 247,
        '/unternehmen/charity/': 232,
        '/courses/9f1bbe5e-23b8-4616-af50-71ae78fa21d0/lessons/ad2cbb92-0163-4dd0-91c6-f39083d2b6eb': 199,
        '/vereinscampus/': 160,
        '/courses/9f1bbe5e-23b8-4616-af50-71ae78fa21d0/detail': 143,
        '/dashboard/my-courses': 141
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
