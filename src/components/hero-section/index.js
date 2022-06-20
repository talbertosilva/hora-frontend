import React from 'react'
import { HiCheck } from 'react-icons/hi';


import './hero-section.css'

export const HeroSection = () => {
  return (
    <div className='hero-section' id='home'>
        <div className='hero-section-text'>
            <h1>Troca serviços por horas!</h1>
            <p>Junta-te a uma comunidade, onde todas as trocas de serviços, são "pagas" na mesma totalidade de horas.</p>
            <button>Saber mais</button>
        </div>
        <div className='hero-section-image'>
            <div className='hover-nome'>
              <h2>Raquel Costa Silva</h2>
              <p>Designer gráfica</p>
              <span>Atualmente disponível</span>
            </div>

            <div className='hover-trocas'>
              <HiCheck className='svg' size={64} color="#8ED975"/>
              <h1>50</h1>
              <p>Trocas concluídas com sucesso</p>
            </div>

            <img src='Homepage_Image.png' alt='homepage image'/>
        </div>
    </div>
  )
}
