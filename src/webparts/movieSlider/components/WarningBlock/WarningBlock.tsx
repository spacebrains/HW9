import * as React from 'react';
import styles from './WarningBlock.module.scss';
import Spinner from '../Spinner/Spinner';


interface IWarningBlockProps {
  message?: string;
  isLoading?: boolean;
}

const WarningBlock: React.FC<IWarningBlockProps> = ({ message, isLoading=false }: IWarningBlockProps) =>
  (<div className={styles.WarningBlock}>
    {isLoading ? <Spinner /> : null}
    {message ? <span>{message}</span> : null}
  </div>
  );


export default WarningBlock;

