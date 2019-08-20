import * as React from 'react';
import styles from './MovieSlider.module.scss';
import * as strings from 'MovieSliderWebPartStrings';
import NavPanel from './NavPanel/NavPanel';
import MovieList from './MovieList/MovieList';
import { IMovie, IMoviesByCategory, ICategory, IWindow, C } from './interfaces';
import { localSetData, localGetData } from './requests/localStorage';
import { loadMovies } from './requests/api';
import WarningBlock from './WarningBlock/WarningBlock';
//import { escape } from '@microsoft/sp-lodash-subset';


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

  private NUMBER_OF_MOVIES = 5;

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
    console.log('componentDidMount');
    this.initalizationData();
  }

  public initalizationData = async (): Promise<void> => {
    console.log('initalizationData');
    try {
      const { category } = this.state;
      const { NUMBER_OF_MOVIES } = this;


      this.allMovies = {
        now_playing: await localGetData(C.now_playing),
        popular: await localGetData(C.popular),
        upcoming: await localGetData(C.upcoming)
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
    console.log('addMovies');
    try {
      this.setState({ isLoading: true });

      const { allMovies } = this;

      const movies: IMovie[] = await loadMovies(category, allMovies[category].length);
      allMovies[category] = [...allMovies[category], ...movies];

      localSetData(category, allMovies[category]);
    }

    catch (error) {
      this.errorHandler(error, 'addMovies');
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
        await this.addMovies();
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