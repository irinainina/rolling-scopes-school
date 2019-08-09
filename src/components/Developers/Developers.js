import React from 'react';
import './Developers.css';
import Developer from '../../components/Developer/Developer';
import { FormattedMessage } from 'react-intl';

import avatarVitalyMikulich from '../../img/developers/VitalyMikulich.jpg';
import avatarPetriken from '../../img/developers/petriken.jpg';
import avatarIrinainina from '../../img/developers/irinainina.jpg';
import avatarAlexSkir from '../../img/developers/AlexSkir.jpg';
import avatarJulanick from '../../img/developers/Julanick.jpg';

function Developers(props) {

  return (
    <section className="developers-container" id="developers">
      <h2>
        <FormattedMessage id="developers" />
      </h2>
      <FormattedMessage id="purpose" />
      <div className="developers">
        <Developer
          name="Vitaly Mikulich"
          gitHub="VitalyMikulich"
          avatar={avatarVitalyMikulich}
        />
        <Developer
          name="Piotr Stashukevich"
          gitHub="petriken"
          avatar={avatarPetriken}
        />
        <Developer
          name="Irina Inina"
          gitHub="irinainina"
          avatar={avatarIrinainina}
        />
        <Developer
          name="Aleksandra Skirnevskaia"
          gitHub="AlexSkir"
          avatar={avatarAlexSkir}
        />
        <Developer
          name="Yuliya Pakidzka"
          gitHub="Julanick"
          avatar={avatarJulanick}
        />
      </div>
    </section>
  );
}

export default Developers;
