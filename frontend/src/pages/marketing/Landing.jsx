import LandingHeader from '../../components/landing/LandingHeader'
import LandingEffects from '../../components/landing/LandingEffects'
import ScrollProgress from '../../components/landing/ScrollProgress'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import HowItWorks from '../../components/landing/HowItWorks'
import RoleTabs from '../../components/landing/RoleTabs'
import StockPreview from '../../components/landing/StockPreview'
import About from '../../components/landing/About'
import Faq from '../../components/landing/Faq'
import CallToAction from '../../components/landing/CallToAction'
import HelpSection from '../../components/landing/HelpSection'
import LandingFooter from '../../components/landing/LandingFooter'
import BackToTop from '../../components/landing/BackToTop'

/* Page publique : présentation de StockPro. */
export default function Landing() {
  return (
    <div>
      <ScrollProgress />
      <LandingEffects />
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <RoleTabs />
        <StockPreview />
        <About />
        <Faq />
        <CallToAction />
        <HelpSection />
      </main>
      <LandingFooter />
      <BackToTop />
    </div>
  )
}
