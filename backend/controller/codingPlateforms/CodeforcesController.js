class CodeforcesController {
    constructor() {
        this.baseURL = 'https://codeforces.com/api';
        this.fallbackURL = 'https://kontests.net/api/v1/codeforces';
        this.lastFetch = null;
        this.cachedData = null;
        this.cacheTimeout = 15 * 60 * 1000; // 15 minutes cache
        this.maxRetries = 3;
        this.timeoutMs = 10000;
    }

    // Main method that your router calls
    static async getContests(req, res) {
        const controller = new CodeforcesController();
        
        try {
            console.log('📊 Fetching Codeforces contests...');
            const result = await controller.getAllContests();
            
            if (result.success) {
                res.json({
                    success: true,
                    data: {
                        upcoming: result.upcomingContests || [],
                        past: result.pastContests || [],
                        platform: 'Codeforces',
                        lastUpdated: result.lastUpdated,
                        totalCount: (result.upcomingContests?.length || 0) + (result.pastContests?.length || 0)
                    },
                    message: 'Contests fetched successfully'
                });
            } else {
                console.error('❌ Failed to fetch Codeforces contests:', result.message);
                res.status(500).json({
                    success: false,
                    error: result.message || 'Failed to fetch contests',
                    details: result.details
                });
            }
        } catch (error) {
            console.error('❌ Unexpected error in Codeforces controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Check if cache is still valid
    isCacheValid() {
        return this.cachedData && this.lastFetch && 
               (Date.now() - this.lastFetch) < this.cacheTimeout;
    }

    async getAllContests() {
        try {
            // Return cached data if valid
            if (this.isCacheValid()) {
                console.log('📦 Returning cached Codeforces data');
                return this.cachedData;
            }

            let upcomingContests = [];
            let pastContests = [];
            let fetchSources = [];

            // Fetch contests with retry logic
            const upcomingResult = await this.fetchWithRetry(this.fetchUpcomingContests.bind(this));
            if (upcomingResult.success) {
                upcomingContests = upcomingResult.contests;
                fetchSources.push(upcomingResult.source);
            }

            const pastResult = await this.fetchWithRetry(this.fetchPastContests.bind(this));
            if (pastResult.success) {
                pastContests = pastResult.contests;
                if (!fetchSources.includes(pastResult.source)) {
                    fetchSources.push(pastResult.source);
                }
            }

            // Check if we got any data
            if (upcomingContests.length === 0 && pastContests.length === 0) {
                return {
                    success: false,
                    message: 'No contests fetched from any available API',
                    details: `Tried sources: ${fetchSources.join(', ')}`
                };
            }

            const result = {
                success: true,
                upcomingContests,
                pastContests,
                lastUpdated: new Date().toISOString(),
                sources: fetchSources,
                totalFetched: upcomingContests.length + pastContests.length
            };

            // Cache the result
            this.cachedData = result;
            this.lastFetch = Date.now();

            console.log(`✅ Codeforces: Fetched ${result.totalFetched} contests from ${fetchSources.join(', ')}`);
            return result;

        } catch (error) {
            console.error('❌ Unexpected error in getAllContests:', error);
            return {
                success: false,
                message: 'Failed to fetch contests',
                details: error.message
            };
        }
    }

    // Fetch with retry logic
    async fetchWithRetry(fetchFunction) {
        let lastError = null;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${this.maxRetries} for ${fetchFunction.name}`);
                const result = await fetchFunction();
                
                if (result.success) {
                    return result;
                }
                
                throw new Error(result.error || 'Fetch failed');
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
                
                if (attempt < this.maxRetries) {
                    const delay = 1000 * Math.pow(2, attempt - 1);
                    console.log(`⏳ Retrying in ${delay/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        console.error(`🚨 All ${this.maxRetries} attempts failed:`, lastError?.message);
        return {
            success: false,
            contests: [],
            source: 'none',
            error: lastError?.message
        };
    }

    async fetchUpcomingContests() {
        try {
            // Try official Codeforces API first
            let response = await fetch(`${this.baseURL}/contest.list?gym=false`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                    'Accept': 'application/json'
                },
                timeout: this.timeoutMs
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            let result = await response.json();
            
            if (result.status === 'OK') {
                const upcoming = result.result
                    .filter(contest => contest.phase === 'BEFORE')
                    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
                    .map(contest => this.formatContest(contest, 'upcoming'));

                return {
                    success: true,
                    contests: upcoming,
                    source: 'codeforces-api'
                };
            } else {
                throw new Error(`API Error: ${result.comment || 'Unknown error'}`);
            }
        } catch (apiError) {
            console.warn('⚠️ Codeforces API failed, trying kontests.net:', apiError.message);
            
            // Fallback to kontests.net API
            try {
                const response = await fetch(this.fallbackURL, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                        'Accept': 'application/json'
                    },
                    timeout: this.timeoutMs
                });

                if (!response.ok) {
                    throw new Error(`Kontests API HTTP ${response.status}: ${response.statusText}`);
                }

                const contests = await response.json();
                const now = new Date();
                
                const upcoming = contests
                    .filter(contest => new Date(contest.start_time) > now)
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .map(contest => this.formatKontestsContest(contest, 'upcoming'));

                return {
                    success: true,
                    contests: upcoming,
                    source: 'kontests-api'
                };
            } catch (fallbackError) {
                console.error('❌ Fallback fetch failed:', fallbackError.message);
                return {
                    success: false,
                    contests: [],
                    source: 'none',
                    error: fallbackError.message
                };
            }
        }
    }

    async fetchPastContests() {
        try {
            const response = await fetch(`${this.baseURL}/contest.list?gym=false`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                    'Accept': 'application/json'
                },
                timeout: this.timeoutMs
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.status === 'OK') {
                const past = result.result
                    .filter(contest => contest.phase === 'FINISHED')
                    .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
                    .slice(0, 50) // Limit to 50 most recent
                    .map(contest => this.formatContest(contest, 'past'));

                return {
                    success: true,
                    contests: past,
                    source: 'codeforces-api'
                };
            } else {
                throw new Error(`API Error: ${result.comment || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('❌ Failed to fetch past contests:', error.message);
            // No fallback for past contests as kontests.net doesn't provide reliable past contest data
            return {
                success: false,
                contests: [],
                source: 'none',
                error: error.message
            };
        }
    }

    // Format contest from official Codeforces API
    formatContest(contest, type) {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const endTime = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);
        
        return {
            id: contest.id,
            name: contest.name,
            platform: 'codeforces',
            url: `https://codeforces.com/contest/${contest.id}`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: Math.round(contest.durationSeconds / 60),
            type: contest.type || 'Unknown',
            phase: contest.phase,
            frozen: contest.frozen || false,
            platformId: `codeforces_${contest.id}`,
            description: `${contest.type || 'Contest'} on Codeforces platform`,
            cardImg: '',
            isActive: type === 'upcoming',
            contestType: type,
            company: 'Codeforces',
            updatedAt: new Date().toISOString(),
            source: 'codeforces-api'
        };
    }

    // Format contest from kontests.net API
    formatKontestsContest(contest, type) {
        const startTime = new Date(contest.start_time);
        const endTime = new Date(contest.end_time);
        
        return {
            id: contest.name.replace(/\s+/g, '_').toLowerCase(),
            name: contest.name,
            platform: 'codeforces',
            url: contest.url,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: Math.round(contest.duration / 60),
            type: 'Unknown',
            phase: type === 'upcoming' ? 'BEFORE' : 'FINISHED',
            frozen: false,
            platformId: `codeforces_kontests_${contest.name.replace(/\s+/g, '_').toLowerCase()}`,
            description: `Contest from ${contest.site || 'Codeforces'}`,
            cardImg: '',
            isActive: type === 'upcoming',
            contestType: type,
            company: 'Codeforces',
            updatedAt: new Date().toISOString(),
            source: 'kontests-api'
        };
    }

    // Get contest standings
    async getContestStandings(contestId, from = 1, count = 50) {
        try {
            console.log(`📊 Fetching standings for contest ${contestId}`);
            
            const response = await fetch(
                `${this.baseURL}/contest.standings?contestId=${contestId}&from=${from}&count=${count}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                        'Accept': 'application/json'
                    },
                    timeout: this.timeoutMs
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.status === 'OK') {
                return {
                    success: true,
                    data: {
                        contest: result.result.contest,
                        problems: result.result.problems,
                        rows: result.result.rows,
                        totalParticipants: result.result.rows?.length || 0
                    }
                };
            } else {
                return {
                    success: false,
                    error: result.comment || 'Failed to fetch contest standings'
                };
            }
        } catch (error) {
            console.error(`❌ Error fetching standings for contest ${contestId}:`, error);
            return {
                success: false,
                error: 'Failed to fetch contest standings',
                details: error.message
            };
        }
    }

    // Get user info
    async getUserInfo(handle) {
        try {
            console.log(`👤 Fetching user info for: ${handle}`);
            
            const response = await fetch(
                `${this.baseURL}/user.info?handles=${handle}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                        'Accept': 'application/json'
                    },
                    timeout: this.timeoutMs
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

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
            console.error(`❌ Error fetching user info for ${handle}:`, error);
            return {
                success: false,
                error: 'Failed to fetch user info',
                details: error.message
            };
        }
    }

    // Get recent user submissions
    async getUserSubmissions(handle, from = 1, count = 10) {
        try {
            console.log(`📝 Fetching submissions for user: ${handle}`);
            
            const response = await fetch(
                `${this.baseURL}/user.status?handle=${handle}&from=${from}&count=${count}`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                        'Accept': 'application/json'
                    },
                    timeout: this.timeoutMs
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.status === 'OK') {
                const submissions = result.result
                    .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds)
                    .map(submission => ({
                        id: submission.id,
                        contestId: submission.contestId,
                        problem: submission.problem,
                        author: submission.author,
                        programmingLanguage: submission.programmingLanguage,
                        verdict: submission.verdict,
                        testset: submission.testset,
                        passedTestCount: submission.passedTestCount,
                        timeConsumedMillis: submission.timeConsumedMillis,
                        memoryConsumedBytes: submission.memoryConsumedBytes,
                        creationTime: new Date(submission.creationTimeSeconds * 1000).toISOString()
                    }));

                return {
                    success: true,
                    data: {
                        submissions,
                        count: submissions.length,
                        handle
                    }
                };
            } else {
                return {
                    success: false,
                    error: result.comment || 'Failed to fetch user submissions'
                };
            }
        } catch (error) {
            console.error(`❌ Error fetching submissions for ${handle}:`, error);
            return {
                success: false,
                error: 'Failed to fetch user submissions',
                details: error.message
            };
        }
    }

    // Get contest problems
    async getContestProblems(contestId) {
        try {
            console.log(`🧩 Fetching problems for contest: ${contestId}`);
            
            const response = await fetch(
                `${this.baseURL}/contest.standings?contestId=${contestId}&from=1&count=1`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                        'Accept': 'application/json'
                    },
                    timeout: this.timeoutMs
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.status === 'OK') {
                const problems = result.result.problems?.map(problem => ({
                    contestId: problem.contestId,
                    index: problem.index,
                    name: problem.name,
                    type: problem.type,
                    rating: problem.rating,
                    tags: problem.tags || [],
                    url: `https://codeforces.com/contest/${contestId}/problem/${problem.index}`
                })) || [];

                return {
                    success: true,
                    data: {
                        contest: result.result.contest,
                        problems,
                        count: problems.length
                    }
                };
            } else {
                return {
                    success: false,
                    error: result.comment || 'Failed to fetch contest problems'
                };
            }
        } catch (error) {
            console.error(`❌ Error fetching problems for contest ${contestId}:`, error);
            return {
                success: false,
                error: 'Failed to fetch contest problems',
                details: error.message
            };
        }
    }

    // Test API connectivity
    async testAPI() {
        try {
            console.log('🧪 Testing Codeforces API connectivity...');
            
            const startTime = Date.now();
            const response = await fetch(`${this.baseURL}/contest.list?gym=false&take=1`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Contest-Tracker/1.0)',
                    'Accept': 'application/json'
                },
                timeout: this.timeoutMs
            });
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (!response.ok) {
                return {
                    status: 'failed',
                    responseTime,
                    error: `HTTP ${response.status}: ${response.statusText}`
                };
            }

            const result = await response.json();
            
            return {
                status: result.status === 'OK' ? 'success' : 'failed',
                responseTime,
                dataReceived: result.result?.length || 0,
                error: result.status !== 'OK' ? result.comment : null
            };
        } catch (error) {
            console.error('❌ API test failed:', error);
            return {
                status: 'failed',
                responseTime: null,
                error: error.message
            };
        }
    }

    // Generate sample data for testing
    generateSampleData() {
        const now = new Date();
        const contests = [];

        // Upcoming contests
        for (let i = 0; i < 3; i++) {
            const startTime = new Date(now);
            startTime.setDate(now.getDate() + (i + 1) * 7);
            startTime.setHours(14, 35, 0, 0);
            
            contests.push({
                id: 2000 + i,
                name: `Codeforces Round ${900 + i} (Div. 2)`,
                platform: 'codeforces',
                url: `https://codeforces.com/contest/${2000 + i}`,
                startTime: startTime.toISOString(),
                endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                duration: 120,
                type: 'CF',
                phase: 'BEFORE',
                frozen: false,
                platformId: `codeforces_${2000 + i}`,
                description: 'Educational Codeforces Round',
                cardImg: '',
                isActive: true,
                contestType: 'upcoming',
                company: 'Codeforces',
                updatedAt: new Date().toISOString(),
                source: 'sample'
            });
        }

        // Past contests
        for (let i = 1; i <= 10; i++) {
            const startTime = new Date(now);
            startTime.setDate(now.getDate() - i * 7);
            startTime.setHours(14, 35, 0, 0);
            
            contests.push({
                id: 1999 - i,
                name: `Codeforces Round ${899 - i} (Div. 2)`,
                platform: 'codeforces',
                url: `https://codeforces.com/contest/${1999 - i}`,
                startTime: startTime.toISOString(),
                endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                duration: 120,
                type: 'CF',
                phase: 'FINISHED',
                frozen: false,
                platformId: `codeforces_${1999 - i}`,
                description: 'Past Codeforces Round',
                cardImg: '',
                isActive: false,
                contestType: 'past',
                company: 'Codeforces',
                updatedAt: new Date().toISOString(),
                source: 'sample'
            });
        }

        const upcoming = contests.filter(c => c.contestType === 'upcoming');
        const past = contests.filter(c => c.contestType === 'past');

        return {
            success: true,
            upcomingContests: upcoming,
            pastContests: past,
            lastUpdated: new Date().toISOString(),
            sources: ['sample'],
            totalFetched: contests.length
        };
    }

    // Emergency fallback
    async emergencyFallback() {
        console.log('🚨 Using emergency fallback data for Codeforces...');
        return this.generateSampleData();
    }

    // Clear cache
    clearCache() {
        this.cachedData = null;
        this.lastFetch = null;
        console.log('🧹 Codeforces cache cleared');
    }

    // Get controller status
    getStatus() {
        return {
            platform: 'Codeforces',
            lastFetch: this.lastFetch ? new Date(this.lastFetch).toISOString() : 'Never',
            cacheValid: this.isCacheValid(),
            cachedContests: this.cachedData?.totalFetched || 0,
            baseURL: this.baseURL,
            fallbackURL: this.fallbackURL
        };
    }
}

export default CodeforcesController;