import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './MainPage.css';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Button, div } from '@material-ui/core';

import SimpleSlider from '../../components/Slider/Slider';
import MainPageNavigation from '../../components/MainPageNavigation/MainPageNavigation';
import MainPageSliderNavigation from '../../components/MainPageSliderNavigation/MainPageSliderNavigation';

import Avatar from '../../components/Avatar/Avatar';

import Description from '../../components/Description/Description';

import Developers from '../../components/Developers/Developers';

import GridGallery from '../../components/GridGalery/GridGalery';
import ru from '../../data/people';
import en from '../../data/peopleEN';
import be from '../../data/peopleBE';
import store from '../../store/store';

function MainPage(props) {
  let data;
  if (props.lang === 'ru') {
    data = ru;
  } else if (props.lang === 'en') {
    data = en;
  } else if (props.lang === 'be') {
    data = be;
  }

  let authorDay;

  function getProfileRand() {
    const profileRand = Math.random() * 8;
    authorDay = Math.floor(profileRand);
    return Math.floor(profileRand);
  }
  const profile = data[getProfileRand()];

  return (
    <>
      <div className="main-page" id="home">

        <section className="main-page-title">
          <p>
            <span className="portal">
              <FormattedMessage id="headerSubtitleSpan" />
            </span>
            <span className="portal-subtitle">
              <FormattedMessage id="headerSubtitle" />
            </span>
          </p>
          <MainPageSliderNavigation/>
        </section>
        <SimpleSlider/>
        <MainPageNavigation />

        <section className="author-day" id="author">
          <h2>
            <FormattedMessage id="todayAuthor" />
          </h2>
          <div className="avatar-description">
            <div className="avatar-datepicker">
              <Avatar data={profile} />
            </div>
            <div className="description-button">
              <Description data={profile} />
              <Button variant="contained" className="author-day-btn">
                <FormattedMessage id="toAuthorPage">
                  {text => (
                    <Link
                      to={`/${props.lang}/personalpage/person${authorDay}`}
                      className="author-day-btn-text"
                      id={authorDay}
                      onClick={(e) => {
                        store.dispatch({
                          type: 'page',
                          value: `/${props.lang}/personalpage/person${authorDay}`,
                        });
                        localStorage.setItem(
                          'page',
                          `/${props.lang}/personalpage/person${authorDay}`,
                        );
                        props.onButtonClick(e);
                      }}
                    >
                      {text}
                    </Link>
                  )}
                </FormattedMessage>
              </Button>
            </div>
          </div>
        </section>

        <section className="description-mainpage" id="project-info">
          <h2>
            <FormattedMessage id="infoAboutPortal" />
          </h2>
          <FormattedHTMLMessage id="welcome" />
          <GridGallery />
        </section>
        </div>
        <Developers/>



    </>
  );
}

MainPage.propTypes = {
  lang: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ lang: state.locales.lang });
export default connect(mapStateToProps)(MainPage);
