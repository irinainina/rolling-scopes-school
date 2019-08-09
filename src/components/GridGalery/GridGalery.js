import React from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';
import { connect } from 'react-redux';
import messages from '../../translations';
import './GridGalery.css';

import Slide1 from '../../img/person_2/portfolio/work6.jpg';
import Slide2 from '../../img/person_3/portfolio/work1.jpg';
import Slide3 from '../../img/person_5/portfolio/work6.jpg';
import Slide4 from '../../img/person_8/portfolio/work6.jpg';
import Slide5 from '../../img/person_2/portfolio/work5.jpg';
import Slide6 from '../../img/person_5/portfolio/work8.jpg';

class GridGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.IMAGES = [{
      src: Slide1,
      thumbnail: Slide1,
      thumbnailWidth: 620,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption1}, ${messages[this.props.lang].name2}`,
      tags: [{
        value: `${messages[this.props.lang].caption1}, ${messages[this.props.lang].name2}`,
        title: `${messages[this.props.lang].caption1}, ${messages[this.props.lang].name2}`,
      }],
    },
    {
      src: Slide2,
      thumbnail: Slide2,
      thumbnailWidth: 580,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption2}, ${messages[this.props.lang].name4}`,
      tags: [{
        value: `${messages[this.props.lang].caption2}, ${messages[this.props.lang].name4}`,
        title: `${messages[this.props.lang].caption2}, ${messages[this.props.lang].name4}`,
      }],
    },

    {
      src: Slide3,
      thumbnail: Slide3,
      thumbnailWidth: 600,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption3}, ${messages[this.props.lang].name6}`,
      tags: [{
        value: `${messages[this.props.lang].caption3}, ${messages[this.props.lang].name6}`,
        title: `${messages[this.props.lang].caption3}, ${messages[this.props.lang].name6}`,
      }],
    },
    {
      src: Slide4,
      thumbnail: Slide4,
      thumbnailWidth: 600,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption4}, ${messages[this.props.lang].name8}`,
      tags: [{
        value: `${messages[this.props.lang].caption4}, ${messages[this.props.lang].name8}`,
        title: `${messages[this.props.lang].caption4}, ${messages[this.props.lang].name8}`,
      }],
    },
    {
      src: Slide5,
      thumbnail: Slide5,
      thumbnailWidth: 580,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption5}, ${messages[this.props.lang].name2}`,
      tags: [{
        value: `${messages[this.props.lang].caption5}, ${messages[this.props.lang].name2}`,
        title: `${messages[this.props.lang].caption5}, ${messages[this.props.lang].name2}`,
      }],
    },
    {
      src: Slide6,
      thumbnail: Slide6,
      thumbnailWidth: 620,
      thumbnailHeight: 300,
      caption: `${messages[this.props.lang].caption6}, ${messages[this.props.lang].name6}`,
      tags: [{
        value: `${messages[this.props.lang].caption6}, ${messages[this.props.lang].name6}`,
        title: `${messages[this.props.lang].caption6}, ${messages[this.props.lang].name6}`,
      }],
    }];
  }

  render() {
    return (
      <Gallery
        images={this.IMAGES}
        rowHeight={300}
        lightboxWidth={1206}
        backdropClosesModal={true}
      />
    );
  }
}

GridGallery.propTypes = {
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ lang: state.locales.lang });
export default connect(mapStateToProps)(GridGallery);
