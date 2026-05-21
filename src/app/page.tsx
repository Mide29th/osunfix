import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TreePine, Hammer, ArrowRight, Map, Activity, TrendingUp, Sparkles, BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
            <Image src="/state-logo.svg" alt="Osun State Logo" width={28} height={28} className="h-7 w-7" />
            <span>OsunFix</span>
          </div>
          <nav className="ml-auto hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 px-3 py-2 rounded-md" href="/map">
              Live Map
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 px-3 py-2 rounded-md" href="/civic-hub">
              Civic Hub
            </Link>
            <Link href="/report">
              <Button variant="default" size="sm" className="ml-2 font-semibold shadow-sm">
                Report an Issue
              </Button>
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden ml-auto">
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-6 md:py-14 lg:py-18 bg-gradient-to-br from-primary/5 via-background to-secondary/10 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm w-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Activity className="mr-1 h-3 w-3" />
                  Live Infrastructure Tracking
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl/none text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  Resilient Infrastructure for <span className="text-primary">Osun State</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                  Report issues, track repairs, and verify carbon savings. Join thousands of citizens making our state safer and greener.
                </p>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                  <Link href="/report">
                    <Button size="lg" className="h-12 px-8 text-base shadow-lg bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 w-full">
                      Report an Issue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/map">
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 bg-background/50 hover:bg-background/80 hover:border-primary/50 text-foreground backdrop-blur-sm w-full">
                      View Live Map
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                        <Image
                          src={`/avatars/${i}.png`}
                          alt={`Community member ${i}`}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>Trusted by 5,000+ residents</div>
                </div>
              </div>

              {/* Hero Image / Graphic Placeholder */}
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none relative animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative aspect-square md:aspect-video lg:aspect-square bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden flex items-center justify-center group hover:shadow-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('/placeholder-map.png')] opacity-20 bg-cover bg-center" />

                  {/* Floating Cards UI Mockup */}
                  <div className="relative z-10 w-3/4 space-y-4">
                    <div className="bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50 transform translate-x-4 group-hover:translate-x-6 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <Hammer className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Pothole Detected</div>
                          <div className="text-xs text-muted-foreground">Iwo Road, Osogbo</div>
                        </div>
                        <div className="ml-auto text-xs font-mono text-orange-600 bg-orange-100 px-2 py-1 rounded">Pending</div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[30%] bg-orange-500 rounded-full" />
                      </div>
                    </div>

                    <div className="bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50 transform -translate-x-4 group-hover:-translate-x-2 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <TreePine className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Drainage Cleared</div>
                          <div className="text-xs text-muted-foreground">Ede Junction</div>
                        </div>
                        <div className="ml-auto text-xs font-mono text-green-600 bg-green-100 px-2 py-1 rounded">Verified</div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <div className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">-12kg CO2</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm text-secondary font-medium">
                Why OsunFix?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Smarter Maintenance. <br className="hidden sm:inline" />Green Impact.
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect directly with state maintenance teams and track the environmental impact of every repair.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="group relative overflow-hidden border-border/50 bg-background/50 hover:bg-background hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
                    <Hammer className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Report & Repair</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Snap a photo, tag the location, and report infrastructure issues in seconds. AI categorizes severity automatically.
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-border/50 bg-background/50 hover:bg-background hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Green Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  We prioritize repairs that prevent flooding and reduce long-term material waste.
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-border/50 bg-background/50 hover:bg-background hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground group-hover:scale-110 transition-transform duration-300">
                    <Map className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Open Data Map</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Real-time visualization of state infrastructure health. See where tax money is working effectively.
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/civic-hub">
                <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 text-primary hover:bg-primary/5">
                  Explore Civic Hub <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Civic Hub Feature Highlight */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  Powered by Gemini AI
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Civic & Accountability Hub
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Track every naira of public spending. Audit government projects with AI, learn your civic rights through interactive flashcards, and get instant answers from Imole AI — your Osun State civic guide.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/civic-hub">
                    <Button size="lg" className="h-12 px-8 shadow-lg w-full sm:w-auto">
                      Open Civic Hub <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/civic-hub">
                    <Button size="lg" variant="outline" className="h-12 px-8 border-primary/20 w-full sm:w-auto">
                      Chat with Imole AI
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-bold text-sm">Project Tracker</p>
                  <p className="text-xs text-muted-foreground">Live progress on constituency projects with AI accountability scores</p>
                </div>
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="font-bold text-sm">Civic Flashcards</p>
                  <p className="text-xs text-muted-foreground">3D flip cards on your rights, budgets, and how government works</p>
                </div>
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-2 col-span-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="font-bold text-sm">Imole AI Chat</p>
                  <p className="text-xs text-muted-foreground">Ask anything about Osun State governance, your rights, or how to report corruption — in plain English or Yoruba</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              See something broken? Report it now.
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">
              Every report you submit goes directly to the state maintenance team. It takes under a minute and makes a real difference.
            </p>
            <Link href="/report">
              <Button size="lg" variant="secondary" className="font-bold text-secondary-foreground shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Report an Issue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-background border-t border-border">
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 OsunFix. Sustainability First.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
              Terms
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
              Privacy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
