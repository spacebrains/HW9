import * as React from 'react';
import { Spinner as OfficeSpinner } from 'office-ui-fabric-react/lib/Spinner';
import styles from './Spinner.module.scss';


const Spinner: React.FC = () =>
	<div className={styles.Spinner}>
		<div className={styles.back}></div>
		<OfficeSpinner size={3} className={styles.OfficeSpinner} />
	</div>;

export default Spinner;