import React from 'react';
import Slider from 'react-slick';
import './SearchSlider.css';

import Slide1 from '../../img/assets/searchSlider/1.jpg';
import Slide2 from '../../img/assets/searchSlider/2.jpg';
import Slide3 from '../../img/assets/searchSlider/3.jpg';
import Slide4 from '../../img/assets/searchSlider/4.jpg';
import Slide5 from '../../img/assets/searchSlider/5.jpg';
import Slide6 from '../../img/assets/searchSlider/6.jpg';
import Slide7 from '../../img/assets/searchSlider/7.jpg';
import Slide8 from '../../img/assets/searchSlider/8.jpg';


export default function SearchSlider() {
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
    </Slider>
  );
}
