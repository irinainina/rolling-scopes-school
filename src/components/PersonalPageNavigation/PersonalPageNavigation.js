import React, { Component } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import './PersonalPageNavigation.css';
import Button from '@material-ui/core/Button';
import Person from '@material-ui/icons/Person';
import Event from '@material-ui/icons/Event';
import ViewList from '@material-ui/icons/ViewList';
import Photo from '@material-ui/icons/Photo';
import Videocam from '@material-ui/icons/Videocam';
import LocationOn from '@material-ui/icons/LocationOn';

export default class PersonalPageNavigation extends Component {
  state = {
    top: '70px',
  }

  listenScrollEvent = () => {
    if (window.scrollY > 70) {
      this.setState({ top: '0px' });
    } else {
      this.setState({ top: '70px' });
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenScrollEvent);
  }

  render() {
    return (
      <div className="page-navigation"
           style={{ top: this.state.top }}>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='200'
          href='#avatar'
          >
          <Person/>
        </AnchorLink>
        </Button>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='40'
          href='#timeline'
          >
          <Event/>
        </AnchorLink>
        </Button>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='40'
          href='#listOfWorks'
          >
          <ViewList/>
        </AnchorLink>
        </Button>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='20'
          href='#imageGalleryComponent'
          >
          <Photo/>
        </AnchorLink>
        </Button>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='40'
          href='#videoPlayer'
          >
          <Videocam/>
        </AnchorLink>
        </Button>
        <Button variant="contained" className="btn-navigation">
        <AnchorLink
          offset='700'
          href='#footer'
          >
          <LocationOn/>
        </AnchorLink>
        </Button>
      </div>
    );
  }
}
