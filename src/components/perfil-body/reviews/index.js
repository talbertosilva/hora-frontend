import React, { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { FiClock } from 'react-icons/fi'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import './reviews.css'
import moment from 'moment'

export const Reviews = ({userID}) => {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
      axios.get("http://localhost:1337/api/getreviews/" + userID ).then(res => setReviews(res.data))
    }, [])
    

    const runCallback = (cb) => {
        return cb();
    };

    return (
        <div className='reviews-container'>
            <p className='reviews-title'>Avaliações</p>
            {reviews.map((review) =>
                <div className='one-review-container'>
                    <div className='review-user'>
                        <div className='user-image-name'>
                            <img alt='review imagem' src={review.foto} />
                            <div className='user-name-trade'>
                                <p className='user-name'>{review.nome}</p>
                                <p className='user-trade'>{review.troca}</p>
                            </div>
                        </div>
                    </div>
                    <div className='review-stars-date'>
                        <div className='stars'>
                            {
                                runCallback(() => {
                                    const row = [];
                                    for (var i = 0; i < review.estrelas; i++) {
                                        row.push(<AiFillStar key={i} />);
                                    }
                                    return row;
                                })
                            }
                            <p>{review.estrelas}</p>
                        </div>
                        <div className='date'>
                            <FiClock />
                            <p>{moment(review.data).utc().format('DD/MM/YYYY')}</p>
                        </div>
                    </div>
                    <div className='review-text'>
                        <p>{review.texto}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
