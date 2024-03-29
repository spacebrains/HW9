import * as React from 'react';
import styles from './MovieList.module.scss';
import { IMovie } from '../interfaces';
import { MSGraphClientFactory } from '@microsoft/sp-http';
import Movie from '../Movie/Movie';



interface IMovieListProps {
  movies: IMovie[];
  MSGClientFactory: MSGraphClientFactory;
  isLoading?: boolean;
  numberOfMovies?: number;
  userName: string;
}


const MovieList: React.FC<IMovieListProps> = ({ movies, MSGClientFactory, isLoading = true, numberOfMovies = 5, userName }: IMovieListProps) => {
  if (movies.length > numberOfMovies)
    movies = movies.slice(0, numberOfMovies).filter(g => g);

  return (
    <ul className={styles.MovieList}>
      {movies.map(m =>
        <li className={styles.movie} key={m.id}>
          <Movie movie={m} isLoading={isLoading} userName={userName} MSGClientFactory={MSGClientFactory}/>
        </li>
      )}
    </ul>
  );
};

export default MovieList;