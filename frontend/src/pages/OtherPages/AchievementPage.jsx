import React from 'react';
import { Trophy, Star, Target, Award, Zap, Crown, Medal, Flame, BookOpen } from 'lucide-react';

const AchievementPage = ({ solvedProblems, completedTopics, quickPracticeScore }) => {
  
  // Achievements System
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Solve your first problem and begin your coding journey",
      icon: <Star className="w-8 h-8" />,
      unlocked: (solvedProblems?.size || 0) >= 1,
      progress: Math.min(solvedProblems?.size || 0, 1),
      target: 1,
      category: "Beginner",
      points: 10,
      color: "from-yellow-400 to-orange-400"
    },
    {
      id: 2,
      title: "Problem Solver",
      description: "Demonstrate consistency by solving 3 problems",
      icon: <Target className="w-8 h-8" />,
      unlocked: (solvedProblems?.size || 0) >= 3,
      progress: Math.min(solvedProblems?.size || 0, 3),
      target: 3,
      category: "Progress",
      points: 25,
      color: "from-blue-400 to-cyan-400"
    },
    {
      id: 3,
      title: "Dedicated Learner",
      description: "Complete your first roadmap topic",
      icon: <Award className="w-8 h-8" />,
      unlocked: (completedTopics?.size || 0) >= 1,
      progress: Math.min(completedTopics?.size || 0, 1),
      target: 1,
      category: "Learning",
      points: 50,
      color: "from-green-400 to-emerald-400"
    },
    {
      id: 4,
      title: "Quick Thinker",
      description: "Score 75% or higher in quick practice",
      icon: <Zap className="w-8 h-8" />,
      unlocked: (quickPracticeScore || 0) >= 75,
      progress: Math.min(quickPracticeScore || 0, 75),
      target: 75,
      category: "Practice",
      points: 30,
      color: "from-purple-400 to-pink-400"
    },
    {
      id: 5,
      title: "Speed Demon",
      description: "Achieve perfect score (100%) in quick practice",
      icon: <Flame className="w-8 h-8" />,
      unlocked: (quickPracticeScore || 0) >= 100,
      progress: Math.min(quickPracticeScore || 0, 100),
      target: 100,
      category: "Mastery",
      points: 100,
      color: "from-red-400 to-orange-500"
    },
    {
      id: 6,
      title: "Knowledge Explorer",
      description: "Complete 3 different roadmap topics",
      icon: <BookOpen className="w-8 h-8" />,
      unlocked: (completedTopics?.size || 0) >= 3,
      progress: Math.min(completedTopics?.size || 0, 3),
      target: 3,
      category: "Learning",
      points: 75,
      color: "from-indigo-400 to-blue-500"
    },
    {
      id: 7,
      title: "Problem Master",
      description: "Solve 10 problems across different topics",
      icon: <Medal className="w-8 h-8" />,
      unlocked: (solvedProblems?.size || 0) >= 10,
      progress: Math.min(solvedProblems?.size || 0, 10),
      target: 10,
      category: "Progress",
      points: 150,
      color: "from-amber-400 to-yellow-500"
    },
    {
      id: 8,
      title: "Elite Coder",
      description: "Complete 5 roadmap topics and solve 20 problems",
      icon: <Crown className="w-8 h-8" />,
      unlocked: (completedTopics?.size || 0) >= 5 && (solvedProblems?.size || 0) >= 20,
      progress: Math.min(((completedTopics?.size || 0) >= 5 && (solvedProblems?.size || 0) >= 20) ? 1 : 0, 1),
      target: 1,
      category: "Elite",
      points: 500,
      color: "from-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
    }
  ];

  // Calculate total points
  const totalPoints = achievements.reduce((sum, achievement) => {
    return sum + (achievement.unlocked ? achievement.points : 0);
  }, 0);

  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Group achievements by category
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Achievements</h1>
          <p className="text-xl text-slate-300 mb-8">
            Track your coding journey and celebrate your progress
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{totalPoints}</div>
              <div className="text-slate-300">Total Points</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-green-400 mb-2">{unlockedCount}</div>
              <div className="text-slate-300">Achievements Unlocked</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">{achievements.length}</div>
              <div className="text-slate-300">Total Achievements</div>
            </div>
          </div>
        </div>

        {/* Achievement Categories */}
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {category === 'Beginner' && <Star className="w-6 h-6 text-yellow-400" />}
              {category === 'Progress' && <Target className="w-6 h-6 text-blue-400" />}
              {category === 'Learning' && <BookOpen className="w-6 h-6 text-green-400" />}
              {category === 'Practice' && <Zap className="w-6 h-6 text-purple-400" />}
              {category === 'Mastery' && <Flame className="w-6 h-6 text-red-400" />}
              {category === 'Elite' && <Crown className="w-6 h-6 text-yellow-400" />}
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    achievement.unlocked
                      ? 'bg-slate-800/70 backdrop-blur-sm border-slate-600 shadow-lg'
                      : 'bg-slate-800/30 backdrop-blur-sm border-slate-700/50'
                  }`}
                >
                  {/* Achievement Card */}
                  <div className="p-6">
                    {/* Icon and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color} ${
                        achievement.unlocked ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <div className={achievement.unlocked ? 'text-white' : 'text-slate-400'}>
                          {achievement.icon}
                        </div>
                      </div>
                      {achievement.unlocked ? (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Unlocked
                        </div>
                      ) : (
                        <div className="bg-slate-600 text-slate-300 px-3 py-1 rounded-full text-sm">
                          Locked
                        </div>
                      )}
                    </div>

                    {/* Title and Description */}
                    <h3 className={`text-xl font-bold mb-2 ${
                      achievement.unlocked ? 'text-white' : 'text-slate-400'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      achievement.unlocked ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={achievement.unlocked ? 'text-slate-300' : 'text-slate-500'}>
                          Progress
                        </span>
                        <span className={achievement.unlocked ? 'text-slate-300' : 'text-slate-500'}>
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                          style={{
                            width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Points */}
                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${achievement.unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                        Category: {achievement.category}
                      </div>
                      <div className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                        {achievement.points} pts
                      </div>
                    </div>
                  </div>

                  {/* Shimmer effect for unlocked achievements */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Progress Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-lg font-semibold text-slate-300 mb-1">Problems Solved</div>
              <div className="text-2xl font-bold text-blue-400">{solvedProblems?.size || 0}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-300 mb-1">Topics Completed</div>
              <div className="text-2xl font-bold text-green-400">{completedTopics?.size || 0}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-300 mb-1">Practice Score</div>
              <div className="text-2xl font-bold text-purple-400">{quickPracticeScore || 0}%</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-300 mb-1">Achievement Rate</div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;