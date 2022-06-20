import React from 'react'
import { CallToAction } from '../../components/call-to-action'
import { ComoFunciona } from '../../components/como-funciona'
import { Footer } from '../../components/footer'
import { HeroSection } from '../../components/hero-section'
import { NavbarHome } from '../../components/navbar-home'
import { NavbarLogged } from '../../components/navbar-logged'
import { Serviços } from '../../components/serviços'
import { Sobre } from '../../components/sobre'

export const Home = () => {
  return (
    <div>
      {localStorage.getItem("token") != null ? <NavbarLogged /> : <NavbarHome />}
      <HeroSection />
      <Sobre />
      <Serviços />
      <ComoFunciona />
      <CallToAction />
      <Footer />
    </div>
  )
}
