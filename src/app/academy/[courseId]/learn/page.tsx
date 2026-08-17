'use client'

import { Button, Badge } from '@/components/ui'
import { 
    Play, ChevronLeft, ChevronRight, 
    Menu, Download,
    Clock, Trophy, Camera, Check, Award, X, Sparkles, Printer, CheckCircle2
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/academy/video-player'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/context/toast-context'

const courseData = {
    title: 'Modern Italian Pasta Masterclass',
    instructor: 'Chef Marco Rossi',
    currentModule: 'Basics & Foundation',
    currentLesson: {
        title: 'Mastering the Classic Dough',
        duration: '45:00',
        videoUrl: '#',
        description: 'In this lesson, we dive deep into the chemistry of flour and eggs, and the physical technique of kneading that develops the perfect gluten structure for your pasta.'
    },
    curriculum: [
        {
            title: 'Basics & Foundation',
            lessons: [
                { title: 'Introduction to Pasta Artistry', duration: '12:00', isCompleted: true },
                { title: 'The Science of Flour & Eggs', duration: '25:00', isCompleted: true },
                { title: 'Mastering the Classic Dough', duration: '45:00', isCompleted: true, isActive: true }
            ]
        },
        {
            title: 'Classic Shapes',
            lessons: [
                { title: 'Tagliatelle & Pappardelle', duration: '30:00', isCompleted: true },
                { title: 'The Art of Farfalle', duration: '22:00', isCompleted: true },
                { title: 'Orrechiette: The Puglian Secret', duration: '35:00', isCompleted: true }
            ]
        }
    ]
}

const QUIZ_QUESTIONS = [
    {
        question: 'What is the optimal egg-to-flour ratio for authentic fresh Northern Italian pasta dough?',
        options: ['1 whole egg per 100g Tipo 00 flour', '1 egg yolk per 250g semolina', '2 eggs per 50g all-purpose flour', 'Water and olive oil only'],
        correct: 0,
    },
    {
        question: 'Why must freshly kneaded pasta dough rest for at least 30 minutes before rolling?',
        options: ['To allow the gluten network to relax and hydrate evenly', 'To dry out the outer surface completely', 'To ferment the natural yeasts', 'To lower the dough temperature to freezing'],
        correct: 0,
    },
    {
        question: 'What gives bronze-die extruded pasta its superior sauce-adhering quality?',
        options: ['Microscopic rough surface texture that grabs emulsions', 'A glossy smooth wax finish', 'Higher sugar content', 'Addition of artificial binders'],
        correct: 0,
    },
    {
        question: 'At what stage should pasta cooking water be heavily salted?',
        options: ['Once the water reaches a rolling boil, before dropping pasta', 'Only after pasta is drained', 'Cold water before turning on the heat', 'Salt is never added to pasta water'],
        correct: 0,
    }
]

export default function LearnPage() {
    const { user, profile } = useAuth()
    const { showToast } = useToast()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [certModalOpen, setCertModalOpen] = useState(false)
    const [quizAnswers, setQuizAnswers] = useState<number[]>([-1, -1, -1, -1])
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizPassed, setQuizPassed] = useState(true)
    const [studentName, setStudentName] = useState(profile?.full_name || 'Joshua Osei-Bonsu')

    const certId = 'CM-CERT-2026-8941'
    const issueDate = 'August 17, 2026'

    const handleSelectOption = (qIdx: number, oIdx: number) => {
        const next = [...quizAnswers]
        next[qIdx] = oIdx
        setQuizAnswers(next)
    }

    const handleGradeQuiz = () => {
        let correctCount = 0
        quizAnswers.forEach((ans, idx) => {
            if (ans === QUIZ_QUESTIONS[idx].correct) correctCount++
        })
        const passed = correctCount >= 3
        setQuizPassed(passed)
        setQuizSubmitted(true)
        if (passed) {
            showToast('🎉 Masterclass Exam Passed with Distinction!', 'success', 'Your verified Certificate of Culinary Artistry is ready.')
        } else {
            showToast('Score below 75%', 'error', 'Please review the lesson modules and retake the test.')
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden text-foreground">
            {/* Top Bar (Custom for Learning) */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/academy" className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="hidden sm:block">
                        <h1 className="text-sm font-black truncate max-w-[200px] lg:max-w-md">{courseData.title}</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-0.5">{courseData.currentModule}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-4 mr-4 px-4 border-r border-border">
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Course Progress</p>
                            <p className="text-sm font-black text-emerald-500">100% Complete</p>
                        </div>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500" />
                        </div>
                    </div>
                    <Button
                        onClick={() => setCertModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                        <Award className="w-4 h-4" />
                        Get Certificate
                    </Button>
                    <button className="p-2 hover:bg-muted rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Video Area */}
                <main className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${sidebarOpen ? 'lg:mr-[400px]' : ''}`}>
                    <div className="bg-zinc-950 p-4 lg:p-8">
                        <VideoPlayer 
                            emoji="🍝"
                            title={courseData.currentLesson.title}
                        />
                    </div>

                    <div className="p-6 lg:p-12 max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <Badge className="mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold uppercase tracking-widest text-[10px]">
                                    Masterclass Complete
                                </Badge>
                                <h1 className="text-3xl lg:text-4xl font-black font-serif">{courseData.currentLesson.title}</h1>
                            </div>
                            <Button
                                onClick={() => setCertModalOpen(true)}
                                className="rounded-2xl h-12 px-8 font-black gap-2 gradient-brand text-white shadow-lg"
                            >
                                <Award className="w-4 h-4" />
                                Claim Master Certificate
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-lg font-bold mb-4">About this lesson</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {courseData.currentLesson.description}
                                    </p>
                                </section>

                                <section className="p-6 rounded-2xl bg-muted/40 border-2 border-border/50">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4">Lesson Resources</h2>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Flour Ratios Cheatsheet.pdf', type: 'PDF' },
                                            { name: 'Master Dough Recipe.pdf', type: 'PDF' },
                                            { name: 'Italian Semolina Suppliers List.xlsx', type: 'XLSX' }
                                        ].map((res, i) => (
                                            <div
                                                key={i}
                                                onClick={() => showToast(`Downloaded ${res.name}`, 'success')}
                                                className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:border-terracotta transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-terracotta" />
                                                    <span className="text-sm font-semibold">{res.name}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-muted-foreground/60">{res.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-8">
                                <div className="p-6 rounded-2xl gradient-brand text-white shadow-lg">
                                    <Trophy className="w-8 h-8 mb-4 opacity-70" />
                                    <h3 className="font-bold mb-2 text-base">Chef Marco&apos;s Pro Tip</h3>
                                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                                        &ldquo;Always weigh your ingredients. Volume measurements for flour are famously inaccurate in artisanal pasta making.&rdquo;
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>

                {/* Sidebar Curriculum */}
                <aside className={`fixed top-16 right-0 bottom-0 w-full lg:w-[400px] bg-card border-l border-border z-40 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border bg-muted/20">
                            <h3 className="font-black text-lg font-serif">Course Curriculum</h3>
                            <p className="text-xs text-emerald-500 font-bold mt-1">100% • 6 / 6 Lessons Completed</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            {courseData.curriculum.map((module, i) => (
                                <div key={i} className="border-b border-border/50">
                                    <div className="p-4 px-6 bg-muted/10 font-black text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                        Module {i + 1}: {module.title}
                                    </div>
                                    <div className="divide-y divide-border/30">
                                        {module.lessons.map((lesson, j) => (
                                            <div key={j} className="p-4 px-6 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer group bg-primary/5">
                                                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 stroke-[4]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold leading-snug text-foreground">{lesson.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-black text-muted-foreground/60 tabular-nums">{lesson.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* CERTIFICATE & EXAM MODAL */}
            {certModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-stone-900 border border-border rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-foreground max-h-[92vh] overflow-y-auto space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-2.5">
                                <Award className="w-6 h-6 text-amber-500" />
                                <div>
                                    <h3 className="text-lg font-bold font-serif">ChefMii Academy Masterclass Certificate</h3>
                                    <p className="text-xs text-muted-foreground">Certified Culinary Completion & Verification</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCertModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {!quizSubmitted ? (
                            /* Final Exam View */
                            <div className="space-y-5">
                                <div className="p-4 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Pass the Final Mastery Exam to Unlock Your Certificate</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Score 75% or higher to earn your accredited digital certificate stamped by {courseData.instructor}.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {QUIZ_QUESTIONS.map((q, qIdx) => (
                                        <div key={qIdx} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                                            <p className="text-xs font-bold text-foreground">Question {qIdx + 1}: {q.question}</p>
                                            <div className="grid grid-cols-1 gap-1.5 pt-1">
                                                {q.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => handleSelectOption(qIdx, oIdx)}
                                                        className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                                            quizAnswers[qIdx] === oIdx
                                                                ? 'gradient-brand text-white border-transparent font-bold shadow-xs'
                                                                : 'bg-card border-border hover:bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleGradeQuiz}
                                    disabled={quizAnswers.includes(-1)}
                                    className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    Grade Exam & Generate Certificate →
                                </button>
                            </div>
                        ) : (
                            /* Gold Bordered Certificate Preview */
                            <div className="space-y-6">
                                {/* Printable Gold Foil Certificate */}
                                <div id="printable-certificate" className="p-8 sm:p-10 rounded-3xl bg-amber-50/90 dark:bg-stone-950 text-stone-900 dark:text-amber-100 border-4 border-double border-amber-500 shadow-2xl relative text-center space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                                        <Award className="w-8 h-8" />
                                        <span className="font-serif font-black text-xl tracking-widest uppercase">ChefMii Academy</span>
                                    </div>
                                    <p className="text-[10px] tracking-widest font-bold uppercase text-stone-500 dark:text-stone-400">
                                        Certificate of Culinary Excellence
                                    </p>

                                    <p className="text-xs italic text-stone-600 dark:text-stone-300">This is to officially certify that</p>
                                    
                                    <input
                                        type="text"
                                        value={studentName}
                                        onChange={e => setStudentName(e.target.value)}
                                        className="text-2xl sm:text-3xl font-serif font-bold text-center bg-transparent border-b border-amber-500/40 text-stone-900 dark:text-amber-200 focus:outline-none w-full max-w-sm mx-auto"
                                    />

                                    <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                                        has successfully passed the examination and demonstrated mastery in the advanced techniques of
                                    </p>

                                    <p className="text-lg sm:text-xl font-bold font-serif text-terracotta">
                                        {courseData.title}
                                    </p>

                                    <div className="pt-6 border-t border-amber-500/30 grid grid-cols-2 gap-4 text-left text-xs">
                                        <div>
                                            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Master Instructor</p>
                                            <p className="font-bold font-serif text-foreground mt-0.5">{courseData.instructor}</p>
                                            <p className="text-[9px] text-stone-500">Trattoria di Marco, London</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Verification ID</p>
                                            <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">{certId}</p>
                                            <p className="text-[9px] text-stone-500">{issueDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setQuizSubmitted(false)}
                                        className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        Retake Exam
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground flex items-center gap-2 shadow-xs"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        Print / PDF
                                    </button>
                                    <button
                                        onClick={() => {
                                            showToast('Certificate Saved to Profile!', 'success')
                                            setCertModalOpen(false)
                                        }}
                                        className="px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Save to Portfolio
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
