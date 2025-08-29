import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Zap, Trophy, Target, RotateCcw, CheckCircle, Crown, XCircle, Star, Brain, Timer, Award } from 'lucide-react';

const QuickPracticePage = ({ onScoreUpdate, currentBestScore = 0 }) => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');

  // Question bank with different difficulties
  const questionBank = {
    easy: [
      {
        question: "What does HTML stand for?",
        options: ["Hypertext Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        correct: 0
      },
      {
        question: "Which of these is NOT a programming language?",
        options: ["Python", "JavaScript", "HTML", "C++"],
        correct: 2
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correct: 1
      },
      {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: ["//", "/*", "#", "--"],
        correct: 0
      },
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var myVar;", "variable myVar;", "declare myVar;", "v myVar;"],
        correct: 0
      },
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        correct: 2
      },
      {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
        correct: 0
      },
      {
        question: "Which of these is a CSS property for text color?",
        options: ["font-color", "text-color", "color", "text-style"],
        correct: 2
      }
    ],
    medium: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1
      },
      {
        question: "In React, what hook is used for managing component state?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: 1
      },
      {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1
      },
      {
        question: "What is closure in JavaScript?",
        options: ["A way to close functions", "Function with access to outer scope variables", "Error handling mechanism", "Loop termination"],
        correct: 1
      },
      {
        question: "Which HTTP method is idempotent?",
        options: ["POST", "GET", "PATCH", "All of the above"],
        correct: 1
      },
      {
        question: "What is the purpose of the 'key' prop in React lists?",
        options: ["Styling", "Performance optimization", "Event handling", "State management"],
        correct: 1
      },
      {
        question: "Which sorting algorithm has the best average case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
        correct: 2
      },
      {
        question: "What is hoisting in JavaScript?",
        options: ["Moving code to top", "Variable/function declarations moved to top of scope", "Error handling", "Memory management"],
        correct: 1
      }
    ],
    hard: [
      {
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 2
      },
      {
        question: "In which phase does React's reconciliation happen?",
        options: ["Mount", "Render", "Commit", "Update"],
        correct: 1
      },
      {
        question: "What design pattern is commonly used in Redux?",
        options: ["Observer", "Singleton", "Flux", "Factory"],
        correct: 2
      },
      {
        question: "Which tree traversal is used in expression evaluation?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correct: 2
      },
      {
        question: "What is the purpose of Web Workers?",
        options: ["DOM manipulation", "Background thread processing", "CSS animations", "HTTP requests"],
        correct: 1
      },
      {
        question: "Which consensus algorithm does Bitcoin use?",
        options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Practical Byzantine Fault Tolerance"],
        correct: 1
      },
      {
        question: "What is tail call optimization?",
        options: ["Memory management", "Recursion optimization", "Loop optimization", "Function caching"],
        correct: 1
      },
      {
        question: "In microservices, what is the Circuit Breaker pattern used for?",
        options: ["Load balancing", "Fault tolerance", "Data consistency", "Service discovery"],
        correct: 1
      }
    ]
  };

  // Generate random questions based on difficulty
  const generateQuestions = useCallback((difficulty, count = 10) => {
    const bank = questionBank[difficulty];
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  // Start game
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setQuestions(generateQuestions(selectedDifficulty, 10));
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  // Handle answer selection
  const selectAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    setUserAnswers(prev => [...prev, {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      correct: isCorrect
    }]);

    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    // Auto advance after 1 second
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        endGame();
      }
    }, 1000);
  };

  // End game
  const endGame = () => {
    setGameState('finished');
    const finalScore = Math.round((score / (questions.length * 10)) * 100);
    if (onScoreUpdate) {
      onScoreUpdate(finalScore);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  // Return to menu
  const returnToMenu = () => {
    setGameState('menu');
  };

  const finalScore = Math.round((score / (questions.length * 10)) * 100);
  const isNewBestScore = finalScore > currentBestScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="text-center">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Quick Practice</h1>
              <p className="text-xl text-slate-300 mb-8">
                Test your coding knowledge in 60 seconds!
              </p>
            </div>

            {/* Best Score Display */}
            {currentBestScore > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Personal Best</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-400">{currentBestScore}%</div>
              </div>
            )}

            {/* Difficulty Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Choose Difficulty</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Easy */}
                <button
                  onClick={() => startGame('easy')}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-green-400">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Easy</h3>
                  <p className="text-slate-300 text-sm mb-4">Basic programming concepts</p>
                  <div className="text-green-400 font-semibold">10 points per question</div>
                </button>

                {/* Medium */}
                <button
                  onClick={() => startGame('medium')}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-yellow-400">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Medium</h3>
                  <p className="text-slate-300 text-sm mb-4">Data structures & algorithms</p>
                  <div className="text-yellow-400 font-semibold">10 points per question</div>
                </button>

                {/* Hard */}
                <button
                  onClick={() => startGame('hard')}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-red-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-red-400">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Hard</h3>
                  <p className="text-slate-300 text-sm mb-4">Advanced concepts & patterns</p>
                  <div className="text-red-400 font-semibold">10 points per question</div>
                </button>
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <span>60 seconds time limit</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>10 points per correct answer</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>Beat your personal best!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div>
            {/* Game Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">{timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">{score} points</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Question</span>
                  <span className="text-white font-semibold">{currentQuestion + 1}/{questions.length}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {questions[currentQuestion] && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">
                  {questions[currentQuestion].question}
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    let buttonClass = "p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ";
                    
                    if (selectedAnswer === null) {
                      buttonClass += "border-slate-600 bg-slate-700/50 hover:border-purple-400 hover:bg-slate-700 text-white";
                    } else if (index === questions[currentQuestion].correct) {
                      buttonClass += "border-green-500 bg-green-500/20 text-green-100";
                    } else if (index === selectedAnswer) {
                      buttonClass += "border-red-500 bg-red-500/20 text-red-100";
                    } else {
                      buttonClass += "border-slate-600 bg-slate-700/30 text-slate-400";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg">{option}</span>
                          {selectedAnswer !== null && index === questions[currentQuestion].correct && (
                            <CheckCircle className="w-6 h-6 text-green-400 ml-auto" />
                          )}
                          {selectedAnswer === index && index !== questions[currentQuestion].correct && (
                            <XCircle className="w-6 h-6 text-red-400 ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="text-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                {difficulty === 'easy' && <Star className="w-4 h-4" />}
                {difficulty === 'medium' && <Brain className="w-4 h-4" />}
                {difficulty === 'hard' && <Target className="w-4 h-4" />}
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
              </span>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <div className="text-center">
            {/* Results Header */}
            <div className="mb-12">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                isNewBestScore ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {isNewBestScore ? (
                  <Crown className="w-10 h-10 text-white" />
                ) : (
                  <Trophy className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                {isNewBestScore ? 'New Personal Best!' : 'Practice Complete!'}
              </h1>
              <p className="text-xl text-slate-300">
                {isNewBestScore ? 'Congratulations on your new record!' : 'Great job completing the practice!'}
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                {finalScore}%
              </div>
              <div className="text-slate-300 mb-6">
                You scored {score} out of {questions.length * 10} points
              </div>
              
              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold text-green-400">{userAnswers.filter(a => a.correct).length}</div>
                  <div className="text-slate-300 text-sm">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{userAnswers.filter(a => !a.correct).length}</div>
                  <div className="text-slate-300 text-sm">Wrong Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{Math.round(((userAnswers.filter(a => a.correct).length / questions.length) * 100))}%</div>
                  <div className="text-slate-300 text-sm">Accuracy</div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="text-slate-300">
                {finalScore >= 90 && "Outstanding! You're a coding master! 🎉"}
                {finalScore >= 80 && finalScore < 90 && "Excellent work! You really know your stuff! 👏"}
                {finalScore >= 70 && finalScore < 80 && "Great job! You're on the right track! 🚀"}
                {finalScore >= 60 && finalScore < 70 && "Good effort! Keep practicing to improve! 💪"}
                {finalScore < 60 && "Don't give up! Practice makes perfect! 📚"}
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="mb-8">
              <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                {difficulty === 'easy' && <Star className="w-5 h-5" />}
                {difficulty === 'medium' && <Brain className="w-5 h-5" />}
                {difficulty === 'hard' && <Target className="w-5 h-5" />}
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode Completed
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => startGame(difficulty)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={returnToMenu}
                className="inline-flex items-center gap-3 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <Target className="w-5 h-5" />
                Change Difficulty
              </button>
            </div>

            {/* Question Review */}
            <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Review Your Answers</h3>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers.find(a => a.questionIndex === index);
                  const isCorrect = userAnswer?.correct;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="text-white font-medium mb-2">
                            Q{index + 1}: {question.question}
                          </div>
                          <div className="text-sm text-slate-300">
                            <div className="mb-1">
                              <span className="font-medium">Your answer: </span>
                              <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                {question.options[userAnswer?.selectedAnswer]}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div>
                                <span className="font-medium">Correct answer: </span>
                                <span className="text-green-400">
                                  {question.options[question.correct]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPracticePage;