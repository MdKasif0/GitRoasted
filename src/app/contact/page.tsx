
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false)

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
      handle: '@Md_Kasif_Uddin',
      url: 'https://twitter.com/Md_Kasif_Uddin',
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
      handle: 'mdkasifuddin@gmail.com',
      url: 'mailto:mdkasifuddin@gmail.com',
      color: '#EA4335',
      description: 'For support, feedback, or partnerships'
    }
  ]

  const copyEmail = () => {
    navigator.clipboard.writeText('mdkasifuddin@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500 bg-background text-foreground">
       <div className="w-full max-w-5xl">
            <div className="relative mb-8 text-center md:text-left">
                <Button asChild variant="ghost" className="absolute -top-2 left-0 md:-left-2 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20 flex">
                <Link href={`/`}>
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                </Button>
                
                <div className="flex flex-col items-center md:items-start">
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
       </div>
    </div>
  )
}

function ContactCard({ method, onCopyEmail, emailCopied }: { method: any, onCopyEmail?: () => void, emailCopied?: boolean }) {
  const Icon = method.icon;

  if (method.id === 'email') {
    return (
        <div className="premium-border-container h-full cursor-pointer" onClick={onCopyEmail}>
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
                <div className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={(e) => { e.stopPropagation(); onCopyEmail?.(); }}>
                        {emailCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <a href={method.url} target="_blank" rel="noopener noreferrer" className="w-full h-full text-left">
      <div className="premium-border-container h-full">
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
            <div className="hidden sm:block">
                <ArrowLeft className="w-6 h-6 text-muted-foreground transform -rotate-45" />
            </div>
        </div>
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
