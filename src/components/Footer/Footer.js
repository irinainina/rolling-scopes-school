import React from 'react';
import './Footer.css';
import { FormattedMessage } from 'react-intl';

function Footer() {
  return (
    <footer id="footer">
      <p><FormattedMessage id="footerRights" /></p>
      <p><FormattedMessage id="footerPS" /></p>
    </footer>
  );
}

export default Footer;
