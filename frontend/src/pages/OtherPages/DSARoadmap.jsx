import React from 'react';
import { CheckCircle, Circle, Code, Clock, BookOpen, ExternalLink, GitBranch, Target } from 'lucide-react';

const DSARoadmap = ({ completedTopics, toggleTopicCompleted }) => {
  
  const roadmapTopics = [
    {
      id: 1,
      title: "Arrays & Strings",
      description: "Master basic data structures and string manipulation techniques",
      problems: 15,
      estimatedTime: "2-3 weeks",
      difficulty: "Beginner",
      color: "from-blue-400 to-cyan-400",
      resources: [
        { name: "LeetCode Array Explore", url: "https://leetcode.com/explore/learn/card/array-and-string/" },
        { name: "GeeksforGeeks Arrays", url: "https://www.geeksforgeeks.org/array-data-structure/" },
        { name: "String Algorithms", url: "https://www.geeksforgeeks.org/string-data-structure/" }
      ],
      keyTopics: ["Two Pointers", "Sliding Window", "String Matching", "Array Manipulation"]
    },
    {
      id: 2,
      title: "Linked Lists",
      description: "Understand pointer manipulation and linear data structures",
      problems: 12,
      estimatedTime: "1-2 weeks",
      difficulty: "Beginner",
      color: "from-green-400 to-emerald-400",
      resources: [
        { name: "LeetCode Linked List", url: "https://leetcode.com/explore/learn/card/linked-list/" },
        { name: "GeeksforGeeks Linked Lists", url: "https://www.geeksforgeeks.org/data-structures/linked-list/" }
      ],
      keyTopics: ["Singly Linked Lists", "Doubly Linked Lists", "Cycle Detection", "Reversal"]
    },
    {
      id: 3,
      title: "Stacks & Queues",
      description: "Learn LIFO and FIFO data structures and their applications",
      problems: 10,
      estimatedTime: "1 week",
      difficulty: "Beginner",
      color: "from-purple-400 to-pink-400",
      resources: [
        { name: "LeetCode Stack & Queue", url: "https://leetcode.com/explore/learn/card/queue-stack/" },
        { name: "Stack Data Structure", url: "https://www.geeksforgeeks.org/stack-data-structure/" }
      ],
      keyTopics: ["Stack Operations", "Queue Implementation", "Monotonic Stack", "Priority Queue"]
    },
    {
      id: 4,
      title: "Trees & Binary Search Trees",
      description: "Master hierarchical data structures and tree algorithms",
      problems: 18,
      estimatedTime: "3-4 weeks",
      difficulty: "Intermediate",
      color: "from-yellow-400 to-orange-400",
      resources: [
        { name: "LeetCode Binary Tree", url: "https://leetcode.com/explore/learn/card/data-structure-tree/" },
        { name: "Binary Tree Algorithms", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/" }
      ],
      keyTopics: ["Tree Traversal", "BST Operations", "Tree Construction", "Lowest Common Ancestor"]
    },
    {
      id: 5,
      title: "Recursion & Backtracking",
      description: "Solve complex problems using recursive approaches",
      problems: 14,
      estimatedTime: "2-3 weeks",
      difficulty: "Intermediate",
      color: "from-red-400 to-pink-400",
      resources: [
        { name: "LeetCode Recursion", url: "https://leetcode.com/explore/learn/card/recursion-i/" },
        { name: "Backtracking Algorithms", url: "https://www.geeksforgeeks.org/backtracking-algorithms/" }
      ],
      keyTopics: ["Recursive Thinking", "Backtracking Patterns", "Permutations", "Combinations"]
    },
    {
      id: 6,
      title: "Dynamic Programming",
      description: "Optimize recursive solutions with memoization and tabulation",
      problems: 20,
      estimatedTime: "4-5 weeks",
      difficulty: "Advanced",
      color: "from-indigo-400 to-purple-400",
      resources: [
        { name: "LeetCode Dynamic Programming", url: "https://leetcode.com/explore/learn/card/dynamic-programming/" },
        { name: "DP Patterns", url: "https://www.geeksforgeeks.org/dynamic-programming/" }
      ],
      keyTopics: ["Memoization", "Tabulation", "1D DP", "2D DP", "State Machines"]
    },
    {
      id: 7,
      title: "Graphs",
      description: "Master graph traversal and shortest path algorithms",
      problems: 16,
      estimatedTime: "3-4 weeks",
      difficulty: "Advanced",
      color: "from-teal-400 to-green-400",
      resources: [
        { name: "LeetCode Graph", url: "https://leetcode.com/explore/learn/card/graph/" },
        { name: "Graph Algorithms", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" }
      ],
      keyTopics: ["BFS/DFS", "Dijkstra's Algorithm", "Union Find", "Topological Sort"]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitBranch className="w-12 h-12 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
            DSA RoadMap
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Structured learning path for data structures & algorithms
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-pink-400">{completedTopics?.size || 0}</div>
              <p className="text-slate-300 text-sm">Topics Completed</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{roadmapTopics.length}</div>
              <p className="text-slate-300 text-sm">Total Topics</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">
                {roadmapTopics.reduce((sum, topic) => sum + topic.problems, 0)}
              </div>
              <p className="text-slate-300 text-sm">Total Problems</p>
            </div>
          </div>

          {/* External Roadmaps */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Comprehensive Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="https://roadmap.sh/computer-science" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Roadmap.sh</div>
                  <div className="text-sm text-slate-400">Computer Science</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>

              <a 
                href="https://neetcode.io/roadmap" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-green-400 transition-colors">NeetCode</div>
                  <div className="text-sm text-slate-400">DSA Roadmap</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-400 transition-colors" />
              </a>

              <a 
                href="https://leetcode.com/explore/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-yellow-400 transition-colors">LeetCode</div>
                  <div className="text-sm text-slate-400">Explore Cards</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Roadmap Topics */}
        <div className="space-y-6">
          {roadmapTopics.map((topic, index) => (
            <div key={topic.id} className="relative">
              {/* Connection Line */}
              {index < roadmapTopics.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-slate-600 to-transparent"></div>
              )}
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center font-bold text-slate-900 text-xl`}>
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{topic.title}</h3>
                        <p className="text-slate-300 mb-3">{topic.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {topic.keyTopics.map((keyTopic, idx) => (
                            <span key={idx} className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-sm">
                              {keyTopic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleTopicCompleted?.(topic.id)}
                        className="text-green-400 hover:text-green-300 transition-colors ml-4"
                      >
                        {completedTopics?.has(topic.id) ? 
                          <CheckCircle className="w-8 h-8" /> : 
                          <Circle className="w-8 h-8" />
                        }
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">{topic.problems} problems</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">{topic.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                        <span className={`text-sm px-2 py-1 rounded border ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-300 text-sm">{topic.resources.length} resources</span>
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        Learning Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topic.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-slate-700/30 hover:bg-slate-600/30 p-3 rounded-lg transition-colors group"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                            <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                              {resource.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DSARoadmap;