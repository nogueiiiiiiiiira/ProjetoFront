import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import style from './Card.module.css';

const Card = ({ title, imgSrc2, desc, value, id }) => {
  const maxDescLength = 100;
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const renderDescription = () => {
    if (desc.length > maxDescLength) {
      return desc.substring(0, maxDescLength) + '...';
    } else {
      return desc;
    }
  };

  return (
    <div className={style.wrapCard}>
      <div className={style.Card}>
        <h3 className={style.cardTitle}>{title || 'Título Desconhecido'}</h3>
        <img
          className={style.img2}
          src={imgSrc2}
          alt={title}
          width={150}
          height="auto"
        />
        <br />
        <div className={style.cardBody}>
          <p className={style.cardText}>{renderDescription()}</p>
          <p>{value || 'Sem informação adicional'}</p>
          <Button variant="primary" onClick={handleShowModal}>
            Ver mais
          </Button>
        </div>
      </div>
  
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='justify-content-center'>
            <img
              src={imgSrc2}
              alt={title}
              className="img-fluid mb-3"
            />
            <p>{desc}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  imgSrc2: PropTypes.string,
  desc: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

Card.defaultProps = {
  title: 'Título Desconhecido',
  imgSrc2: 'https://via.placeholder.com/150',
  desc: 'Descrição não disponível',
  value: 'Sem informação adicional',
};

export default Card;