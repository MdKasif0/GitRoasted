'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function CompareClient() {
  const router = useRouter()
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
     const trimmedUser1 = user1.trim()
     const trimmedUser2 = user2.trim()
     
     if (!trimmedUser1 || !trimmedUser2) {
       setError('Please enter both usernames')
       return
     }
     
     if (trimmedUser1.toLowerCase() === trimmedUser2.toLowerCase()) {
       setError('Please enter different usernames')
       return
     }
     
     setLoading(true)
     
     // Encode usernames to handle special characters
     const encoded1 = encodeURIComponent(trimmedUser1)
     const encoded2 = encodeURIComponent(trimmedUser2)
     
     router.push(`/compare/${encoded1}/vs/${encoded2}`)
   }

  const handleSuggestion = (u1: string, u2: string) => {
    setUser1(u1);
    setUser2(u2);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500 bg-background text-foreground">
        <div className="w-full max-w-5xl">
             <div className="relative mb-8 text-center">
                <Button asChild variant="ghost" className="absolute top-0 left-0 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20 flex">
                    <Link href={`/`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter gradient-text">GitClash ⚔️</h1>
                    <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                        Compare two developers and see who dominates.
                    </p>
                </div>
            </div>

            <Card className="p-6 sm:p-8 bg-black/20 backdrop-blur-lg border-purple-500/30">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
                    {/* User 1 Input */}
                    <div className="w-full md:w-5/12 text-center md:text-left p-4 rounded-lg bg-white/5">
                        <label htmlFor='user1-input' className="text-sm font-bold text-primary">Player 1</label>
                        <Input
                            id="user1-input"
                            type="text"
                            placeholder="Enter username..."
                            value={user1}
                            onChange={(e) => setUser1(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                            className="w-full h-12 mt-2 text-lg text-center md:text-left bg-transparent border-white/10"
                        />
                    </div>

                    {/* VS Separator */}
                    <div className="w-full md:w-2/12 flex items-center justify-center">
                         <div className="text-4xl font-black text-primary/50">VS</div>
                    </div>

                    {/* User 2 Input */}
                     <div className="w-full md:w-5/12 text-center md:text-left p-4 rounded-lg bg-white/5">
                        <label htmlFor='user2-input' className="text-sm font-bold text-primary">Player 2</label>
                        <Input
                            id="user2-input"
                            type="text"
                            placeholder="Enter username..."
                            value={user2}
                            onChange={(e) => setUser2(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                            className="w-full h-12 mt-2 text-lg text-center md:text-left bg-transparent border-white/10"
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                 <div className="mt-8 flex justify-center">
                    <Button 
                        onClick={handleCompare}
                        disabled={loading}
                        size="lg"
                        className="h-14 px-12 text-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold"
                    >
                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching...</> : 'Compare Now 🔥'}
                    </Button>
                </div>
            </Card>

            <div className="mt-12 text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">Popular Comparisons</h3>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    <Button onClick={() => handleSuggestion('torvalds', 'gaearon')} variant="outline" size="sm">torvalds vs gaearon</Button>
                    <Button onClick={() => handleSuggestion('tj', 'sindresorhus')} variant="outline" size="sm">tj vs sindresorhus</Button>
                    <Button onClick={() => handleSuggestion('rauchg', 'yyx990803')} variant="outline" size="sm">rauchg vs yyx990803</Button>
                </div>
            </div>
        </div>
    </div>
  )
}
