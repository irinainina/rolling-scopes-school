import React, { Component } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import './MainPageSliderNavigation.css';
import { FormattedMessage } from 'react-intl';

export default class MainPageSliderNavigation extends Component {


  render() {
    return (
      <div className="mainpage-navigation-container">
        <AnchorLink offset="40px" href="#author">
          <FormattedMessage id="todayAuthor" />
        </AnchorLink>
        <AnchorLink offset="40px" href="#project-info">
          <FormattedMessage id="infoAboutPortal" />
        </AnchorLink>
        <AnchorLink offset="40px" href="#developers">
          <FormattedMessage id="developers" />
        </AnchorLink>
      </div>
    );
  }
}
