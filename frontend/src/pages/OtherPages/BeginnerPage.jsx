import React, { useState } from 'react';
import { CheckCircle, Circle, Star, Code, Clock } from 'lucide-react';

const BeginnerPage = ({ solvedProblems, toggleProblemSolved }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Beginner DSA Problems
  const beginnerProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      hints: ["Use a hash map to store complements", "Check if complement exists while iterating"],
      solution: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    {
      id: 2,
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string. The input string is given as an array of characters s.",
      hints: ["Use two pointers", "Swap characters from both ends moving inward"],
      solution: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    },
    {
      id: 3,
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      hints: ["Use a stack data structure", "Push opening brackets, pop for closing brackets"],
      solution: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    {
      id: 4,
      title: "Maximum Subarray",
      difficulty: "Easy",
      description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      hints: ["Use Kadane's algorithm", "Keep track of current sum and maximum sum"],
      solution: `def max_subarray(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    },
    {
      id: 5,
      title: "Binary Search",
      difficulty: "Easy",
      description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      hints: ["Use divide and conquer", "Compare middle element with target"],
      solution: `def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)"
    },
    {
      id: 6,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted manner.",
      hints: ["Use a dummy node", "Compare values and link smaller nodes"],
      solution: `def merge_two_lists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next`,
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(1)"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Beginner Problems
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            Start your coding journey with carefully selected beginner-friendly problems
          </p>
          
          {/* Progress Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {solvedProblems?.size || 0}/{beginnerProblems.length}
              </div>
              <p className="text-slate-300">Problems Solved</p>
              <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((solvedProblems?.size || 0) / beginnerProblems.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6">
          {beginnerProblems.map((problem) => (
            <div 
              key={problem.id} 
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleProblemSolved?.(problem.id)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {solvedProblems?.has(problem.id) ? 
                      <CheckCircle className="w-7 h-7" /> : 
                      <Circle className="w-7 h-7" />
                    }
                  </button>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedProblem(selectedProblem === problem.id ? null : problem.id)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  {selectedProblem === problem.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              <p className="text-slate-300 mb-4 leading-relaxed">{problem.description}</p>

              {selectedProblem === problem.id && (
                <div className="space-y-6 mt-6 pt-6 border-t border-slate-700">
                  {/* Hints */}
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      💡 Hints
                    </h4>
                    <ul className="space-y-2">
                      {problem.hints.map((hint, index) => (
                        <li key={index} className="text-slate-300 flex items-start gap-3">
                          <span className="text-yellow-400 font-bold">•</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      🔧 Solution
                    </h4>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-200">
                        <code>{problem.solution}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Complexity */}
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">Time: </span>
                      <span className="text-blue-400 font-mono">{problem.timeComplexity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-purple-400 rounded"></div>
                      <span className="text-slate-300">Space: </span>
                      <span className="text-purple-400 font-mono">{problem.spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeginnerPage;