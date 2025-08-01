import axios from "axios";

// LeetCode GraphQL endpoint
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

// GraphQL query for contest list
const CONTESTS_QUERY = `
  query getContests {
    contests {
      title
      titleSlug
      startTime
      duration
    }
  }
`;

export const getLeetCodeContests = async (req, res) => {
  try {
    console.log("Start Fetching")
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      { query: CONTESTS_QUERY },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const contests = response.data?.data?.contests || [];

    // Separate upcoming and past based on time
    const now = Date.now() / 1000; // seconds
    const upcoming = contests.filter(c => c.startTime > now);
    const past = contests.filter(c => c.startTime <= now);

    const format = (arr) => arr.map(c => ({
      name: c.title,
      slug: c.titleSlug,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      startTime: new Date(c.startTime * 1000),
      duration: `${Math.floor(c.duration / 3600)} hr ${Math.floor((c.duration % 3600) / 60)} min`
    }));

    res.status(200).json({
      upcomingContests: format(upcoming),
      pastContests: format(past),
    });

  } catch (error) {
    console.error("LeetCode API error:", error.message);
    res.status(500).json({ message: "Failed to fetch LeetCode contests" });
  }
};
