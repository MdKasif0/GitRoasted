
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const { toast } = useToast()

  const contactMethods = [
    {
      id: 'github',
      name: 'GitHub',
      icon: FaGithub,
      handle: '@MdKasif0',
      url: 'https://github.com/MdKasif0/GitRoasted',
      color: '#A855F7',
      description: 'Check out the code, report issues, or contribute'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: FaTwitter,
      handle: '@md_kasif_uddin',
      url: 'https://twitter.com/md_kasif_uddin',
      color: '#1DA1F2',
      description: 'Follow for updates, tips, and community highlights'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      handle: '@md_kasif_uddin',
      url: 'https://instagram.com/md_kasif_uddin',
      color: '#E4405F',
      description: 'Behind-the-scenes and developer stories'
    },
    {
      id: 'email',
      name: 'Email',
      icon: FaEnvelope,
      handle: 'mdkasifuddin123@gmail.com',
      url: 'mailto:mdkasifuddin123@gmail.com',
      color: '#EA4335',
      description: 'For support, feedback, or partnerships'
    }
  ]

  const copyEmail = () => {
    navigator.clipboard.writeText('mdkasifuddin123@gmail.com')
    setCopiedEmail(true)
    toast({
        title: 'Email Copied!',
        description: 'The email address has been copied to your clipboard.',
    })
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const faqItems = [
    {
        question: "How quickly will I get a response?",
        answer: "We typically respond within 24-48 hours on weekdays. For urgent issues, reach out on Twitter for a faster response."
    },
    {
        question: "Can I request a feature?",
        answer: "Absolutely! Share your ideas on X (Twitter) or open a discussion on our GitHub repository. We love hearing from our community."
    },
    {
        question: "How do I report a bug?",
        answer: "Please open an issue on our GitHub repository with details about the bug, steps to reproduce, and screenshots if possible."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500 bg-background text-foreground">
       <div className="w-full max-w-5xl">
            <div className="relative mb-8 text-center md:text-center">
                <Button asChild variant="ghost" className="absolute -top-2 left-0 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20 flex">
                <Link href={`/`}>
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                </Button>
                
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter gradient-text">Get in Touch 💬</h1>
                    <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                        Have questions, feedback, or just want to say hi? We'd love to hear from you!
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {contactMethods.map((method) => (
                <ContactCard 
                    key={method.id}
                    method={method}
                    onCopyEmail={method.id === 'email' ? copyEmail : undefined}
                    emailCopied={copiedEmail && method.id === 'email'}
                />
                ))}
            </div>

             <div className="mt-12 grid sm:grid-cols-3 gap-6">
                <InfoCard 
                    title="💡 Quick Response"
                    description="We typically respond within 24-48 hours on weekdays."
                />
                <InfoCard 
                    title="🐛 Found a Bug?"
                    description="Report issues directly on our GitHub repository."
                />
                <InfoCard 
                    title="🎯 Feature Request?"
                    description="Share your ideas on X (Twitter) or open a GitHub discussion."
                />
            </div>
            
            <div className="faq-section">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
       </div>
    </div>
  )
}

function ContactCard({ method, onCopyEmail, emailCopied }: { method: any, onCopyEmail?: () => void, emailCopied?: boolean }) {
  const Icon = method.icon;

  const cardContent = (
    <div className={cn("premium-card-content flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 p-6 h-full")}>
        <div 
            className="p-4 rounded-full"
            style={{ background: `${method.color}20`, border: `2px solid ${method.color}80`}}
        >
            <Icon className="w-8 h-8" style={{ color: method.color }} />
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold">{method.name}</h3>
            <p className="text-primary font-semibold">{method.handle}</p>
            <p className="text-muted-foreground text-sm mt-1">{method.description}</p>
        </div>
        {method.id === 'email' && onCopyEmail && (
            <div className="hidden sm:block">
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCopyEmail(); }}>
                    {emailCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
            </div>
        )}
        {method.id !== 'email' && (
            <div className="hidden sm:block">
                <ArrowLeft className="w-6 h-6 text-muted-foreground transform -rotate-45" />
            </div>
        )}
    </div>
  );

  return (
    <a href={method.url} onClick={(e) => {if (method.id === 'email') e.preventDefault()}} target={method.id === 'email' ? '_self' : '_blank'} rel="noopener noreferrer" className="w-full h-full text-left">
      <div className="premium-border-container h-full">
        {cardContent}
      </div>
    </a>
  );
}


function InfoCard({ title, description }: { title: string, description: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 text-center">
            <h3 className="text-lg font-bold text-primary">{title}</h3>
            <p className="text-muted-foreground mt-2">{description}</p>
        </div>
    )
}
