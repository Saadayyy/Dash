const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Data for last 14 days (grouped by week)
const statsData = [
    { date: '09/16/2024', impressions: { organic: 260, sponsored: 1398 }, clicks: { organic: 5, sponsored: 6 }, reactions: 7, comments: 0, shares: 0 },
    { date: '09/17/2024', impressions: { organic: 545, sponsored: 1129 }, clicks: { organic: 20, sponsored: 9 }, reactions: 15, comments: 0, shares: 2 },
    { date: '09/18/2024', impressions: { organic: 284, sponsored: 2476 }, clicks: { organic: 11, sponsored: 3 }, reactions: 5, comments: 0, shares: 3 },
    { date: '09/19/2024', impressions: { organic: 700, sponsored: 19312 }, clicks: { organic: 45, sponsored: 74 }, reactions: 67, comments: 2, shares: 3 },
    { date: '09/20/2024', impressions: { organic: 457, sponsored: 11550 }, clicks: { organic: 21, sponsored: 45 }, reactions: 36, comments: 1, shares: 2 },
    { date: '09/21/2024', impressions: { organic: 178, sponsored: 6950 }, clicks: { organic: 3, sponsored: 41 }, reactions: 10, comments: 0, shares: 0 },
    { date: '09/22/2024', impressions: { organic: 302, sponsored: 6161 }, clicks: { organic: 13, sponsored: 38 }, reactions: 25, comments: 0, shares: 1 },
    { date: '09/23/2024', impressions: { organic: 1387, sponsored: 3331 }, clicks: { organic: 95, sponsored: 20 }, reactions: 67, comments: 5, shares: 3 },
    { date: '09/24/2024', impressions: { organic: 796, sponsored: 4156 }, clicks: { organic: 44, sponsored: 30 }, reactions: 28, comments: 2, shares: 1 },
    { date: '09/25/2024', impressions: { organic: 447, sponsored: 675 }, clicks: { organic: 19, sponsored: 10 }, reactions: 8, comments: 0, shares: 0 },
    { date: '09/26/2024', impressions: { organic: 311, sponsored: 158 }, clicks: { organic: 15, sponsored: 1 }, reactions: 49, comments: 4, shares: 0 },
    { date: '09/27/2024', impressions: { organic: 581, sponsored: 0 }, clicks: { organic: 16, sponsored: 0 }, reactions: 22, comments: 0, shares: 1 },
    { date: '09/28/2024', impressions: { organic: 261, sponsored: 0 }, clicks: { organic: 2, sponsored: 0 }, reactions: 4, comments: 0, shares: 1 },
    { date: '09/29/2024', impressions: { organic: 211, sponsored: 0 }, clicks: { organic: 10, sponsored: 0 }, reactions: 3, comments: 0, shares: 0 }
];

// Competitor Data
const competitorsData = [
    { name: "WEKO", followers: 1476, newFollowers: 45, interactions: 157, posts: 20 },
    { name: "Sellmore GmbH", followers: 997, newFollowers: 41, interactions: 166, posts: 8 },
    { name: "isales GmbH", followers: 557, newFollowers: 37, interactions: 244, posts: 6 },
    { name: "CompData Computer GmbH", followers: 687, newFollowers: 83, interactions: 197, posts: 7 },
    { name: "DPS Business Solutions", followers: 2039, newFollowers: 254, interactions: 584, posts: 15 },
];

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
    return ((current - previous) / previous) * 100;
}

// Calculate weekly totals
const weeklyTotals = calculateWeeklyTotals(statsData);

// Calculate percentage changes
const percentageChanges = {
    reactions: calculatePercentageChange(weeklyTotals.week2.reactions, weeklyTotals.week1.reactions),
    comments: calculatePercentageChange(weeklyTotals.week2.comments, weeklyTotals.week1.comments),
    shares: calculatePercentageChange(weeklyTotals.week2.shares, weeklyTotals.week1.shares)
};

// Route to serve the dashboard
app.get('/', (req, res) => {
    res.render('dashboard', {
        statsData,
        competitorsData,
        weeklyTotals,
        percentageChanges
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
