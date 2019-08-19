import * as React from 'react';
import styles from './MovieList.module.scss';
import { IMovie } from '../interfaces';
import Movie from '../Movie/Movie';



interface IMovieListProps {
  movies: IMovie[];
  isLoading?: boolean;
  numberOfMovies?: number;
}


const MovieList: React.FC<IMovieListProps> = ({ movies, isLoading = false, numberOfMovies = 4 }: IMovieListProps) => {
  if (movies.length > numberOfMovies)
    movies = movies.slice(0, numberOfMovies).filter(g => g);

  return (
    <ul className={styles.MovieList}>
      {movies.map(m =>
        <li className={styles.movie} key={m.id}>
          <Movie movie={m} isLoading={isLoading} />
        </li>
      )}
    </ul>
  );
};

export default MovieList;