import * as React from 'react';
import * as strings from 'MovieSliderWebPartStrings';
import styles from './Movie.module.scss';
import WarningBlock from '../WarningBlock/WarningBlock';
import { PrimaryButton } from 'office-ui-fabric-react';
import Spinner from '../Spinner/Spinner';
import { IMovie } from '../interfaces';



interface IMovieProps {
	movie: IMovie;
	isLoading?: boolean;
	numberOfMovies?: number;
}


const Movie: React.FC<IMovieProps> = ({ movie, numberOfMovies = 2, isLoading = false }: IMovieProps) => {
	const IMG_URL = 'https://image.tmdb.org/t/p/w400';

	if (movie) {
		const genres = movie.genres.slice(0, numberOfMovies).filter(g => g);
		return (
			<div className={styles.Movie}>
				{isLoading ? <Spinner /> : null}
				<div className={styles.main} style={{ backgroundImage: `url(${IMG_URL + movie.poster})` }}>
					<footer>
						<div className={styles.scale}>
							<div className={styles.rating} style={{ width: `${movie.rating * 10}%` }}></div>
						</div>
						<ul className={styles.genres}> {genres.map(g => <li className={styles.genres_li}>{g.name}</li>)} </ul>
					</footer>
				</div>
				<div className={styles.menu}>
					<div className={styles.back}></div>
					<div className={styles.back__container}>
						<PrimaryButton text='в пизду' className={styles.button} />
						<PrimaryButton text='и ещё в пизду' className={styles.button} />
					</div>
				</div>
			</div>
		);
	}

	else
		return (
			<div className={styles.Movie}>
				<div className={styles.Movie__not_found}></div>
				{isLoading ? <Spinner /> : null}
			</div>
		);
};

export default Movie;