
// CodeforcesController.js
class CodeforcesController {
    constructor() {
        this.baseURL = 'https://codeforces.com/api';
        this.contestsAPI = 'https://kontests.net/api/v1/codeforces';
    }

    async getUpcomingContests() {
        try {
            // First try official Codeforces API
            const response = await fetch(`${this.baseURL}/contest.list`);
            const result = await response.json();
            
            if (result.status === 'OK') {
                const upcomingContests = result.result.filter(contest => 
                    contest.phase === 'BEFORE'
                );

                return {
                    success: true,
                    data: upcomingContests.map(contest => ({
                        id: contest.id,
                        name: contest.name,
                        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
                        duration: contest.durationSeconds,
                        type: contest.type,
                        phase: contest.phase,
                        frozen: contest.frozen || false,
                        url: `https://codeforces.com/contest/${contest.id}`,
                        platform: 'Codeforces'
                    }))
                };
            } else {
                throw new Error('Codeforces API returned error status');
            }
        } catch (error) {
            // Fallback to kontests.net
            try {
                const response = await fetch(this.contestsAPI);
                const contests = await response.json();
                
                const now = new Date();
                const upcomingContests = contests.filter(contest => {
                    const startTime = new Date(contest.start_time);
                    return startTime > now;
                });

                return {
                    success: true,
                    data: upcomingContests.map(contest => ({
                        id: contest.name,
                        name: contest.name,
                        startTime: contest.start_time,
                        endTime: contest.end_time,
                        duration: contest.duration,
                        url: contest.url,
                        platform: 'Codeforces'
                    }))
                };
            } catch (fallbackError) {
                return {
                    success: false,
                    error: 'Failed to fetch upcoming contests',
                    details: fallbackError.message
                };
            }
        }
    }

    async getPastContests(limit = 20) {
        try {
            const response = await fetch(`${this.baseURL}/contest.list`);
            const result = await response.json();
            
            if (result.status === 'OK') {
                const pastContests = result.result
                    .filter(contest => contest.phase === 'FINISHED')
                    .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
                    .slice(0, limit);

                return {
                    success: true,
                    data: pastContests.map(contest => ({
                        id: contest.id,
                        name: contest.name,
                        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
                        duration: contest.durationSeconds,
                        type: contest.type,
                        phase: contest.phase,
                        url: `https://codeforces.com/contest/${contest.id}`,
                        platform: 'Codeforces'
                    }))
                };
            } else {
                throw new Error('Codeforces API returned error status');
            }
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch past contests',
                details: error.message
            };
        }
    }

    async getContestStandings(contestId, from = 1, count = 50) {
        try {
            const response = await fetch(
                `${this.baseURL}/contest.standings?contestId=${contestId}&from=${from}&count=${count}`
            );
            const result = await response.json();
            
            if (result.status === 'OK') {
                return {
                    success: true,
                    data: {
                        contest: result.result.contest,
                        problems: result.result.problems,
                        rows: result.result.rows
                    }
                };
            } else {
                return {
                    success: false,
                    error: result.comment || 'Failed to fetch contest standings'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch contest standings',
                details: error.message
            };
        }
    }

    async getUserInfo(handle) {
        try {
            const response = await fetch(`${this.baseURL}/user.info?handles=${handle}`);
            const result = await response.json();
            
            if (result.status === 'OK') {
                return {
                    success: true,
                    data: result.result[0]
                };
            } else {
                return {
                    success: false,
                    error: result.comment || 'User not found'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch user info',
                details: error.message
            };
        }
    }
}
export default CodeforcesController