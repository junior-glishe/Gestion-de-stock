import { useState } from 'react'
import Reveal from './Reveal'

/* Formulaire de contact « centre d'aide ». */
export default function HelpSection() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <section id="aide" className="max-w-6xl mx-auto px-5 py-20">
      <div className="text-center max-w-xl mx-auto">
        <Reveal as="h2" className="text-3xl sm:text-4xl font-bold">
          Centre d'aide
        </Reveal>
        <p className="mt-4 text-neutral-600 leading-7">
          Une question, une suggestion ? Écrivez-nous, nous vous répondrons rapidement.
        </p>
      </div>

      <Reveal as="form" id="helpForm" className="mt-10 max-w-4xl mx-auto" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            required
            type="email"
            placeholder="Votre e-mail"
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-brand h-11"
          />
          <textarea
            required
            rows="2"
            placeholder="Votre message"
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-brand resize-none h-11"
          />
        </div>

        <button
          type="submit"
          className="btn-landing mt-4 w-full bg-brand hover:bg-brand-dark text-white rounded-lg py-2.5 font-medium shadow-md shadow-brand/20"
        >
          Envoyer le message
        </button>

        <p
          id="helpOk"
          className={`mt-4 flex items-center gap-2 rounded-lg bg-brand-light text-brand-dark text-sm px-4 py-3 ${
            sent ? 'pop-in' : 'hidden'
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
          Message envoyé. Nous vous répondrons sous 24 h.
        </p>
      </Reveal>
    </section>
  )
}
