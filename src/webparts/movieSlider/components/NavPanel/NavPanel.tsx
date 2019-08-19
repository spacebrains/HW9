import * as React from 'react';
import * as strings from 'MovieSliderWebPartStrings';
import styles from './NavPanel.module.scss';
import { ICategory, C } from '../interfaces';
import { string } from 'prop-types';



interface INavPanelProps {
	category: ICategory;
	onChangeCategory: Function;
}


const NavPanel: React.FC<INavPanelProps> = ({ category, onChangeCategory }: INavPanelProps) => {
	const onSelect = (e: React.MouseEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		onChangeCategory(target.value);
	};

	return (
		<div className={styles.NavPanel}>
			<input
				type="radio"
				id='radio_1'
				name='categories'
				checked={category === C.now_playing}
				value={C.now_playing}
				onClick={onSelect}
				className={styles.radio}
			/>
			<label htmlFor="radio_1" className={styles.label}>{strings.Now_playing}</label>

			<input
				type="radio"
				id='radio_2'
				name='categories'
				checked={category === C.popular}
				value={C.popular}
				onClick={onSelect}
				className={styles.radio}
			/>
			<label htmlFor="radio_2" className={styles.label}>{strings.Popular}</label>

			<input
				type="radio"
				id='radio_3'
				name='categories'
				checked={category === C.upcoming}
				value={C.upcoming}
				onClick={onSelect}
				className={styles.radio}
			/>
			<label htmlFor="radio_3" className={styles.label}>{strings.UpComing}</label>
		</div>
	);
};

export default NavPanel;