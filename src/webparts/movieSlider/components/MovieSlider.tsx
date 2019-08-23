import * as React from 'react';
import styles from './MovieSlider.module.scss';
import * as strings from 'MovieSliderWebPartStrings';
import NavPanel from './NavPanel/NavPanel';
import MovieList from './MovieList/MovieList';
import { IMovie, IMoviesByCategory, ICategory, IWindow } from './interfaces';
import C from './constants';
import { MSGraphClientFactory } from '@microsoft/sp-http';
import { setLocalData, getLocalData } from './requests/localStorage';
import { loadMoviesFromMDB } from './requests/MoviesApi';
import { getUserName } from './requests/GraphApi';
import WarningBlock from './WarningBlock/WarningBlock';

export interface IMovieSliderProps {
  MSGClientFactory: MSGraphClientFactory;
}

interface IState {
  window: IWindow;
  message: string;
  isLoading: boolean;
  category: ICategory;
  currentMovies: IMovie[];
}

export default class MovieSlider extends React.PureComponent<IMovieSliderProps, {}> {
  private NUMBER_OF_MOVIES = 5;
  private userName: string;
  private allMovies: IMoviesByCategory = {
    now_playing: [],
    popular: [],
    upcoming: []
  };
  private page: number = 1;

  public state: IState = {
    window: C.warning,
    message: strings.Load,
    isLoading: true,
    category: C.now_playing,
    currentMovies: []
  };


  public componentDidMount(): void {
    this.initalizationData();
  }

  public initalizationData = async (): Promise<void> => {
    try {
      const { category, } = this.state;
      const { NUMBER_OF_MOVIES } = this;
      this.userName = await getUserName(this.props.MSGClientFactory);
      this.allMovies = {
        now_playing: await getLocalData(C.now_playing),
        popular: await getLocalData(C.popular),
        upcoming: await getLocalData(C.upcoming)
      };
      if (!this.allMovies[category] || this.allMovies[category].length < NUMBER_OF_MOVIES) {
        await this.addMovies(category);
      }

      const newState: IState = {
        ...this.state,
        currentMovies: this.allMovies[category].slice(0, NUMBER_OF_MOVIES),
        window: C.main,
        isLoading: false
      };
      this.setState(newState);
    }
    catch (error) {
      this.errorHandler(error, 'initalizationData');
    }
  }


  private addMovies = async (category: ICategory = this.state.category): Promise<void> => {
    try {
      this.setState({ isLoading: true });
      const { allMovies } = this;

      const movies: IMovie[] = await loadMoviesFromMDB(category, allMovies[category].length);
      allMovies[category] = [...allMovies[category], ...movies];
      setLocalData(category, allMovies[category]);
    }

    catch (error) {
      this.errorHandler(error, 'addMovies');
    }
  }


  private shiftMovies = async (shift: -1 | 1): Promise<void> => {
    try {
      const { category } = this.state;
      const { allMovies, NUMBER_OF_MOVIES } = this;
      const allMoviesLength = allMovies[category].length;

      let newPage = this.page + shift;
      if (newPage < 1) {
        return null;
      }
      else if (newPage > allMoviesLength / NUMBER_OF_MOVIES) {
        await this.addMovies();
      }

      this.page = newPage;
      const newState: IState = {
        ...this.state,
        isLoading: false,
        currentMovies: allMovies[category].slice((newPage - 1) * NUMBER_OF_MOVIES, newPage * NUMBER_OF_MOVIES)
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
        await this.addMovies(category);

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


  public render(): React.ReactElement<IMovieSliderProps> {
    const { isLoading, window, currentMovies } = this.state;
    if (window === C.main) {
      return (
        <main className={styles.movieSlider}>
          <div className={styles.nav}>
            <NavPanel category={this.state.category} onChangeCategory={this.onChangeCategory} />
          </div>
          <div className={styles.slider}>
            <button className={styles.button} onClick={() => this.shiftMovies(-1)}>{'<'}</button>
            <MovieList
              numberOfMovies={this.NUMBER_OF_MOVIES}
              isLoading={isLoading}
              movies={currentMovies}
              userName={this.userName}
              MSGClientFactory={this.props.MSGClientFactory}
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