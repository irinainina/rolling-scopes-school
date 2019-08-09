import React from 'react';
import Slider from 'react-slick';
import './Slider.css';

import Slide1 from '../../img/assets/slider/1.jpg';
import Slide2 from '../../img/assets/slider/2.jpg';
import Slide3 from '../../img/assets/slider/3.jpg';
import Slide4 from '../../img/assets/slider/4.jpg';
import Slide5 from '../../img/assets/slider/5.jpg';
import Slide6 from '../../img/assets/slider/6.jpg';
import Slide7 from '../../img/assets/slider/7.jpg';
import Slide8 from '../../img/assets/slider/8.jpg';
import Slide9 from '../../img/assets/slider/9.jpg';
import Slide10 from '../../img/assets/slider/10.jpg';
import Slide11 from '../../img/assets/slider/11.jpg';
import Slide12 from '../../img/assets/slider/12.jpg';


export default function SimpleSlider() {
  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    fade: true,
    speed: 1000,
    autoplaySpeed: 8000,
    pauseOnHover: false,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src={`${Slide1}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide2}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide3}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide4}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide5}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide6}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide7}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide8}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide9}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide10}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide11}`} alt="slide" />
      </div>
      <div>
        <img src={`${Slide12}`} alt="slide" />
      </div>
    </Slider>
  );
}
