'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Check,
  Clock,
  Bug,
  Lightbulb,
  Mail,
} from 'lucide-react'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import { useToast } from '@/hooks/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Minimal modern X (Twitter) icon SVG
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const { toast } = useToast()

  const contactMethods = [
    {
      id: 'github',
      name: 'GitHub',
      icon: FaGithub,
      iconColor: 'text-white',
      handle: '@MdKasif0',
      url: 'https://github.com/MdKasif0/GitRoasted',
      description: 'Check out the code, report issues, or contribute.',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: XIcon,
      iconColor: 'text-white',
      handle: '@md_kasif_uddin',
      url: 'https://twitter.com/md_kasif_uddin',
      description: 'Follow for updates, tips, and community highlights.',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      iconColor: 'text-white',
      handle: '@md_kasif_uddin',
      url: 'https://instagram.com/md_kasif_uddin',
      description: 'Behind-the-scenes and developer stories.',
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      iconColor: 'text-[#FF8A00]',
      handle: 'mdkasifuddin123@gmail.com',
      url: 'mailto:mdkasifuddin123@gmail.com',
      description: 'For support, feedback, or partnerships.',
    },
  ]

  const copyEmail = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
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
      question: 'How quickly will I get a response?',
      answer:
        'We typically respond within 24-48 hours on weekdays. For urgent issues, reach out on Twitter for a faster response.',
    },
    {
      question: 'Can I request a feature?',
      answer:
        'Absolutely! Share your ideas on X (Twitter) or open a discussion on our GitHub repository. We love hearing from our community.',
    },
    {
      question: 'How do I report a bug?',
      answer:
        'Please open an issue on our GitHub repository with details about the bug, steps to reproduce, and screenshots if possible.',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F5F5F5] selection:bg-[#FF8A00]/25 selection:text-[#FF8A00] flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="w-full max-w-[1140px] flex flex-col">
        {/* Top Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 bg-[#0B0B0B] hover:bg-[#141414] hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header + Quote Badge */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#FF8A00] text-xs font-mono font-semibold tracking-widest uppercase mb-3">
              <span>GET IN TOUCH</span>
              <span className="w-6 h-[2px] bg-[#FF8A00]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Get in Touch
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#8B949E] leading-relaxed">
              Have questions, feedback, or just want to say hi? We&apos;d love to hear from you!
            </p>
          </div>

          {/* Editorial quote block (desktop) */}
          <div className="hidden lg:flex flex-col justify-center px-5 py-4 rounded-xl border border-white/[0.07] bg-[#0A0A0A] text-xs font-mono text-neutral-400 max-w-xs shrink-0 self-start">
            <p className="text-neutral-300 font-sans text-xs leading-relaxed">
              Better developers
              <br />
              build a brighter internet.
            </p>
            <div className="w-5 h-[2px] bg-[#FF8A00] my-2.5" />
            <span className="text-neutral-500 text-[11px] font-mono">— GitRoasted</span>
          </div>
        </header>

        {/* CONTACT SECTION */}
        <section aria-labelledby="contact-heading" className="mb-12 sm:mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span
              id="contact-heading"
              className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold"
            >
              CONTACT
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {contactMethods.map((method) => {
              const Icon = method.icon
              const isEmail = method.id === 'email'

              return (
                <div
                  key={method.id}
                  className="relative group bg-[#0B0B0B] hover:bg-[#0F0F0F] border border-white/[0.08] hover:border-white/[0.18] rounded-xl p-5 sm:p-6 transition-all duration-200"
                >
                  <a
                    href={method.url}
                    target={isEmail ? '_self' : '_blank'}
                    rel={isEmail ? undefined : 'noopener noreferrer'}
                    className="flex items-start justify-between gap-4 w-full h-full"
                    onClick={(e) => {
                      if (isEmail) {
                        // Let default mailto execute or copy
                      }
                    }}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                        <Icon className={`w-5 h-5 ${method.iconColor}`} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-white tracking-tight">
                          {method.name}
                        </h3>
                        <span className="text-sm font-mono text-[#FF8A00] font-medium truncate block mt-0.5">
                          {method.handle}
                        </span>
                        <p className="text-xs sm:text-sm text-[#8B949E] mt-1 line-clamp-2 leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Icon: Arrow or Copy */}
                    <div className="shrink-0 pt-0.5">
                      {isEmail ? (
                        <button
                          type="button"
                          onClick={copyEmail}
                          aria-label="Copy email address"
                          title="Copy email address"
                          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          {copiedEmail ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <div className="p-2 text-neutral-500 group-hover:text-white transition-colors">
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      )}
                    </div>
                  </a>
                </div>
              )
            })}
          </div>
        </section>

        {/* SUPPORT GUIDANCE SECTION */}
        <section aria-labelledby="support-heading" className="mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              id="support-heading"
              className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold"
            >
              NEED HELP?
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-white/[0.08] py-2">
            {/* Guidance item 1 */}
            <div className="flex items-start gap-3.5 md:pr-6">
              <Clock className="w-5 h-5 text-[#FF8A00] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Quick Response
                </h4>
                <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">
                  We typically respond within 24–48 hours on weekdays.
                </p>
              </div>
            </div>

            {/* Guidance item 2 */}
            <div className="flex items-start gap-3.5 md:px-6">
              <Bug className="w-5 h-5 text-[#FF8A00] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Found a Bug?
                </h4>
                <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">
                  Report issues directly on our GitHub repository.
                </p>
              </div>
            </div>

            {/* Guidance item 3 */}
            <div className="flex items-start gap-3.5 md:pl-6">
              <Lightbulb className="w-5 h-5 text-[#FF8A00] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Feature Request?
                </h4>
                <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">
                  Share your ideas on X (Twitter) or open a GitHub discussion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section aria-labelledby="faq-heading">
          <div className="flex items-center gap-3 mb-4">
            <span
              id="faq-heading"
              className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold"
            >
              FAQ
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-sm text-[#8B949E]">
              Quick answers to common questions.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="border-b border-white/[0.08] last:border-b-0"
              >
                <AccordionTrigger className="py-4 sm:py-5 text-sm sm:text-base font-medium text-neutral-200 hover:text-white hover:no-underline transition-colors [&>svg]:text-neutral-400 [&[data-state=open]>svg]:text-[#FF8A00]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#8B949E] leading-relaxed pb-5 pt-0">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  )
}
