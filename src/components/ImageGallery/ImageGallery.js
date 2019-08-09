import React from 'react';
import { FormattedMessage } from 'react-intl';
import ImageGallery from 'react-image-gallery';
import './ImageGallery.css';
import PropTypes from 'prop-types';

function ImageGalleryComponent(props) {
  const images = [];
  props.data.works.forEach((item) => {
    const obj = {
      original: item.image,
      thumbnail: item.image,
      description: item.description,
    };
    images.push(obj);
  });

  return (
    <div id="imageGalleryComponent"
         className="imageGallery">
      <h2 style={{
        textAlign: 'center', fontSize: '44px', marginTop: 60,
      }}>
        <FormattedMessage id="imageGalery"/>
      </h2>
      <ImageGallery items={images} className="images"/>
    </div>
  );
}

ImageGalleryComponent.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ImageGalleryComponent;
