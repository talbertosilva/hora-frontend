import React, { useRef } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { Link, generatePath, useNavigate } from 'react-router-dom'

import './servicos.css'

export const Serviços = () => {
  const carousel = useRef(null)
  const navigate = useNavigate()

  const handleLeftClick = (e) => {
    carousel.current.scrollLeft -= carousel.current.offsetWidth / 1.5
  }

  const handleRightClick = (e) => {
    carousel.current.scrollLeft += carousel.current.offsetWidth / 1.5
  }

  const handleLink = (e) => {
    navigate("/anuncios/" + e)
  }

  return (
    <div className='serviços-container'>
      <h1>Troque serviços em dezenas de categorias!</h1>
      <div className='cards-buttons'>
        <button className='button-left' onClick={handleLeftClick}>
          <BsChevronLeft size={24} />
        </button>
        <div className='cards' ref={carousel}>

          <div className='card card-1' onClick={() => handleLink("Jardinagem")}>
            <p>Jardinagem</p>
          </div>

          <div className='card card-2' onClick={() => handleLink("Carpintaria")}>
            <p>Carpintaria</p>
          </div>
          <div className='card card-3' onClick={() => handleLink("Design")}>
            <p>Design gráfico</p>
          </div>
          <div className='card card-4' onClick={() => handleLink("Explicações")}>
            <p>Explicações</p>
          </div>
          <div className='card card-5' onClick={() => handleLink("Arquitetura")}>
            <p>Arquitetura</p>
          </div>
          <div className='card card-6' onClick={() => handleLink("Negócios e economia")}>
            <p>Contabilidade</p>
          </div>
          <div className='card card-7' onClick={() => handleLink("Cuidados infantis")}>
            <p>Cuidados infantis</p>
          </div>
          <div className='card card-8' onClick={() => handleLink("Eletricidade")}>
            <p>Eletricidade</p>
          </div>
          <div className='card card-9' onClick={() => handleLink("")}>
            <p>Ver mais</p>
          </div>
        </div>
        <button className='button-right' onClick={handleRightClick}>
          <BsChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
