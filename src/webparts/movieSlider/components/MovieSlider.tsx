import * as React from 'react';
import styles from './MovieSlider.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'MovieSliderWebPartStrings';
import NavPanel from './NavPanel/NavPanel';
import MovieList from './MovieList/MovieList';
import {
  IGenre, IResMovie, IMovie,
  IMoviesByCategory, ICategory,
  IWindow, Tkey, C
} from './interfaces';
import WarningBlock from './WarningBlock/WarningBlock';


export interface IMovieSliderProps {
  description: string;
}



interface IState {
  window: IWindow;
  message: string;
  isLoading: boolean;
  category: ICategory;
  currentMovies: IMovie[];
}


export default class MovieSlider extends React.PureComponent<IMovieSliderProps, {}> {
  private KEY = '57f28580932896b3e3c54cd033265039';
  private NUMBER_OF_MOVIES = 5;

  private allMovies: IMoviesByCategory = {
    now_playing: [],
    popular: [],
    upcoming: []
  };
  private genres: IGenre[] = [];
  private page: number = 1;


  public state: IState = {
    window: C.warning,
    message: strings.Load,
    isLoading: true,
    category: C.now_playing,
    currentMovies: []
  };



  public componentDidMount(): void {
    console.log('componentDidMount');
    this.initalizationData();
  }

  public initalizationData = async (): Promise<void> => {
    console.log('initalizationData');
    try {
      const currentGenres: IGenre[] = await this.localGetData(C.genres);
      if (!currentGenres || currentGenres.length === 0) {
        await this.loadGenres();
      }

      let currentMovies: IMovie[] = await this.localGetData(C.now_playing);
      if (!currentMovies || currentMovies.length < this.NUMBER_OF_MOVIES) {
        currentMovies = await this.loadMovies(C.now_playing);
      }

      this.allMovies = {
        ...this.allMovies,
        popular: await this.localGetData(C.popular),
        upcoming: await this.localGetData(C.upcoming)
      };

      const newState: IState = {
        ...this.state,
        currentMovies: currentMovies.slice(0, this.NUMBER_OF_MOVIES),
        window: C.main,
        isLoading: false
      };
      this.setState(newState);
    }
    catch (error) {
      this.errorHandler(error, 'invitalizationData');
    }
  }



  private loadMovies = async (category: ICategory = this.state.category): Promise<IMovie[]> => {
    console.log('loadMovies');
    try {
      this.setState({ ...this.state, isLoading: true });
      const NUMBER_OF_RESULTS = 20;

      let { allMovies } = this;
      const page = (allMovies[category].length / NUMBER_OF_RESULTS) + 1;

      const URL = `https://api.themoviedb.org/3/movie/${category}?api_key=${this.KEY}&language=${strings.Lang}&page=${page}`;

      const response = await fetch(URL);
      const json = await response.json();

      const results: IResMovie[] = json.results;
      const movies = await this.parseMovies(results);
      allMovies[category] = [...allMovies[category], ...movies];
      this.localSetData(category, allMovies[category]);

      return movies;
    }
    catch (error) {
      this.errorHandler(error, 'loadMovies');
      return [];
    }
  }

  private parseMovies = async (data: IResMovie[]): Promise<IMovie[]> => {
    console.log('parseMovies');
    try {
      const genres: IGenre[] = this.genres.length > 0 ? this.genres : await this.loadGenres();

      const movies: IMovie[] = data.map(i => {
        const movie: IMovie = {
          id: i.id,
          title: i.title,
          rating: i.vote_average,
          poster: i.poster_path,
          genres: i.genre_ids.map(gI => genres.find(g => g.id === gI))
        };
        return movie;
      });
      return movies;
    }
    catch (error) {
      this.errorHandler(error, 'parseMovies');
    }
  }


  private loadGenres = async (): Promise<IGenre[]> => {
    console.log('loadGenres');
    try {
      const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.KEY}&language=${strings.Lang}`;

      const response = await fetch(URL);
      const json = await response.json();
      const { genres } = json;
      this.genres = genres;

      this.localSetData(C.genres, genres);
      return genres;
    }
    catch (error) {
      this.errorHandler(error, 'loadGenres');
      return [];
    }
  }



  private shiftMovies = async (shift: -1 | 1): Promise<void> => {
    console.log('shiftMovies');
    try {
      const { category } = this.state;
      const { allMovies, NUMBER_OF_MOVIES } = this;

      const allMoviesLength = allMovies[category].length;

      let newPage = this.page + shift;
      if (newPage < 1) {
        return null;
      }
      else if (newPage > allMoviesLength / NUMBER_OF_MOVIES) {
        await this.loadMovies();
      }

      this.page = newPage;
      const newState: IState = {
        ...this.state,
        currentMovies: allMovies[category].slice((newPage - 1) * NUMBER_OF_MOVIES, newPage * NUMBER_OF_MOVIES),
        isLoading: false
      };
      this.setState(newState);
    }
    catch (error) {
      this.errorHandler(error, 'shiftMovies');
    }
  }

  private onChangeCategory = async (category: ICategory): Promise<void> => {
    try {
      const { allMovies, NUMBER_OF_MOVIES } = this;
      if (!allMovies[category] || allMovies[category].length < NUMBER_OF_MOVIES)
        await this.loadMovies(category);

      this.page = 1;
      const newState: IState = {
        ...this.state,
        category: category,
        currentMovies: allMovies[category].slice(0, NUMBER_OF_MOVIES),
        isLoading: false
      };
      this.setState(newState);
    }
    catch (error) {
      this.errorHandler(error, 'onChangeCategory');
    }
  }



  private localSetData = (key: Tkey, data: IMovie[] | IGenre[]): void => {
    console.log('localSetData', key);
    const obj = {
      data: data,
      datetime: new Date()
    };

    localStorage.setItem(key, JSON.stringify(obj));
  }

  private localGetData = async <T extends []>(key: Tkey): Promise<T> => {
    console.log('localGetData', key);
    try {
      const json = localStorage.getItem(key);
      if (json) {
        const { data, datetime } = await JSON.parse(json);
        return +new Date() - +new Date(datetime) < 86400000 ? data : [];
      }
      else return [] as T;
    }
    catch (error) {
      this.errorHandler(error, 'localGetData');
      return [] as T;
    }
  }



  private errorHandler(error: Error, functionName: string = ""): void {
    console.error(functionName, error);
    const newState: IState = {
      ...this.state,
      isLoading: false,
      window: C.warning,
      message: error.message
    };
    this.setState(newState);
  }

  public componentWillUnmount(): void {
    console.log('componentWillUnmount');
  }



  public render(): React.ReactElement<IMovieSliderProps> {
    console.log('render', this.state);
    const { currentMovies, isLoading, window } = this.state;
    if (window === C.main) {
      return (
        <main className={styles.movieSlider}>
          <div className={styles.nav}>
            <NavPanel category={this.state.category} onChangeCategory={this.onChangeCategory} />
          </div>
          <div className={styles.slider}>
            <button className={styles.button} onClick={() => this.shiftMovies(-1)}>{'<'}</button>
            <MovieList
              movies={currentMovies}
              numberOfMovies={this.NUMBER_OF_MOVIES}
              isLoading={isLoading}
            />
            <button className={styles.button} onClick={() => this.shiftMovies(1)}>{'>'}</button>
          </div>
        </main >
      );
    }
    else if (window === C.warning) {
      return (
        <WarningBlock message={this.state.message} isLoading={isLoading} />
      );
    }
  }
}