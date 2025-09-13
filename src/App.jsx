import React, { useState, useEffect } from 'react'
import { Globe, Trophy, ChevronRight, Send, Github, Settings, Eye } from 'lucide-react'
import countriesData from '../countries_with_borders.json'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Input } from './components/ui/input'

function App() {
  const [countries, setCountries] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hardMode, setHardMode] = useState(false)
  const [wasRevealed, setWasRevealed] = useState(false)

  useEffect(() => {
    const countriesWithBorders = countriesData.filter(country =>
      country.borders && country.borders.length >= 2
    )
    setCountries(countriesWithBorders)
    if (countriesWithBorders.length > 0) {
      generateQuestion(countriesWithBorders)
    }
  }, [])

  const generateQuestion = (availableCountries) => {
    if (availableCountries.length === 0) return

    const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)]

    setCurrentQuestion(randomCountry)
    setUserAnswer('')
    setShowFeedback(false)
    setGameStarted(true)
    setIsCorrect(false)
    setWasRevealed(false)
  }

  const normalizeString = (str) => {
    return str.toLowerCase()
      .trim()
      .replace(/[^\w]/g, '') // Remove all non-alphanumeric characters including spaces
  }

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const normalizedAnswer = normalizeString(userAnswer)
    const normalizedCorrect = normalizeString(currentQuestion.name)

    // Create variations of the correct country name
    const correctName = currentQuestion.name
    const variations = [
      correctName,
      correctName.replace(/\(.*?\)/g, '').trim(), // Remove parentheses content
      correctName.replace(/\bthe\s+/gi, ''), // Remove "the"
      correctName.replace(/\brepublic\s+of\s+/gi, ''), // Remove "republic of"
      correctName.replace(/\s+republic$/gi, ''), // Remove trailing "republic"
      correctName.replace(/\bof\s+/gi, ''), // Remove "of"
      correctName.replace(/\bunited\s+states\s+of\s+america/gi, 'america'), // US variations
      correctName.replace(/\bdemocratic\s+people\'?s\s+republic\s+of\s+/gi, ''), // North Korea etc
      correctName.replace(/\bislamic\s+republic\s+of\s+/gi, ''), // Iran etc
      correctName.replace(/\bfederated\s+states\s+of\s+/gi, ''), // Micronesia etc
    ].map(normalizeString)

    // Check if answer is contained in any variation or vice versa
    const correct = variations.some(variation => {
      return variation.includes(normalizedAnswer) ||
             normalizedAnswer.includes(variation) ||
             variation === normalizedAnswer
    }) ||
    // Additional check: if answer is at least 3 chars and matches beginning
    (normalizedAnswer.length >= 3 && variations.some(variation =>
      variation.startsWith(normalizedAnswer) || normalizedAnswer.startsWith(variation)
    ))

    setIsCorrect(correct)
    setShowFeedback(true)
    setTotalQuestions(prev => prev + 1)

    if (correct) {
      setScore(prev => prev + 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    checkAnswer()
  }

  const handleRevealAnswer = () => {
    setIsCorrect(false) // Mark as incorrect since they revealed
    setWasRevealed(true) // Track that this was revealed
    setShowFeedback(true)
    setTotalQuestions(prev => prev + 1)
  }

  const handleNextQuestion = () => {
    generateQuestion(countries)
  }

  const getFlagPath = (countryCode) => {
    return `https://raw.githubusercontent.com/hampusborgos/country-flags/refs/heads/main/svg/${countryCode.toLowerCase()}.svg`
  }

  if (!gameStarted || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Globe className="h-6 w-6 animate-spin" />
              <span className="text-lg font-medium text-foreground">Loading game...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">Neighbours</h1>
              </div>
              <p className="text-sm text-muted-foreground ml-8">Guess the country from its neighbours</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-medium text-foreground">Score: {score} / {totalQuestions}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHardMode(!hardMode)}
                className="h-auto p-2"
                aria-label={hardMode ? "Switch to Easy Mode" : "Switch to Hard Mode"}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-1 text-sm">{hardMode ? 'Hard' : 'Easy'}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-auto p-2"
              >
                <a
                  href="https://github.com/anthropics/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code on GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-6">
            {/* Neighbors with Flags */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
                  The Neighbours
                </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentQuestion.borders.map((border, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                      <img
                        src={getFlagPath(border.code)}
                        alt={`Flag of ${border.name}`}
                        className="w-16 h-auto rounded border border-border"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      {!hardMode && (
                        <Badge variant="secondary" className="text-xs px-2 py-1 text-center">
                          {border.name}
                        </Badge>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Question and Input */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-center mb-4 text-foreground">
                  What's the country?
                  {hardMode && <span className="block text-sm font-normal text-muted-foreground mt-1">Hard Mode: Flags only!</span>}
                </h3>

              {!showFeedback ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Type the country name..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="text-lg p-4"
                      autoFocus
                    />
                  <div className="flex justify-center gap-3">
                    <Button type="submit" size="lg" className="px-8">
                      Submit Answer
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleRevealAnswer}
                      className="px-6"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Reveal
                    </Button>
                  </div>
                </form>
                ) : (
                  <div className="text-center space-y-4">
                    {userAnswer && (
                      <div className="text-lg font-medium text-muted-foreground">
                        Your answer: <span className="font-semibold text-foreground">{userAnswer}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback */}
            {showFeedback && (
              <div className="space-y-4">
                <Card className={isCorrect
                  ? 'bg-muted border-border'
                  : 'bg-muted border-destructive'}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="text-lg font-semibold text-foreground">
                        {isCorrect
                          ? 'Correct! Well done!'
                          : wasRevealed
                          ? 'The correct answer was:'
                          : 'Wrong! The correct answer was:'
                        }
                      </div>

                      {/* Show correct answer with flag */}
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src={getFlagPath(currentQuestion.code)}
                          alt={`Flag of ${currentQuestion.name}`}
                          className="w-24 h-auto rounded-lg border border-border"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <div className="text-xl font-bold text-foreground">
                          {currentQuestion.name}
                        </div>

                        {/* Show neighbor names in hard mode */}
                        {hardMode && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-2">The Neighbours</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {currentQuestion.borders.map((border, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                  {border.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button onClick={handleNextQuestion} size="lg" className="px-8">
                    Next Question
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App