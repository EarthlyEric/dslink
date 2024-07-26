import { faCheck, faExclamation, faInfo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../animation.css';

interface AlertProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  onClose: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

const Alert: FC<AlertProps> = ({ message, type, onClose, autoDismiss = true, dismissTime = 1500 }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return '';
    }
  };

  const getAlertIcons = () => {
    switch (type) {
      case 'info':
        return faInfo;
      case 'success':
        return faCheck;
      case 'warning':
        return faExclamation;
      case 'danger':
        return faExclamation;
      default:
        return faInfo;
    }
  };

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(onClose, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, onClose]);

  return (
    <CSSTransition in={true} timeout={250} classNames="alert" unmountOnExit>
      <div className={`flex w-full md:w-96 shadow-lg rounded-lg ${getAlertStyles()} fixed bottom-0 left-0 right-0 mx-auto mb-4 md:mb-8`}>
        <div className="py-4 px-6 rounded-l-lg flex items-center text-white">
          <FontAwesomeIcon icon={getAlertIcons()} />
        </div>
        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
          <div className="text-black">{message}</div>
          <button className="text-sm text-black" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Alert;
