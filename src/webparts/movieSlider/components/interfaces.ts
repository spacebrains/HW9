type warning = 'warning';
type main = 'main';

export type IWindow = warning | main;

type now_playing = 'now_playing';
type popular = 'popular';
type upcoming = 'upcoming';

export type ICategory = now_playing | popular | upcoming;

type genres = 'genres';

export type Tkey = ICategory | genres;

export interface IActs {
  iWillGo: boolean;
  intresting: boolean;
}

export interface IC {
  warning: warning;
  main: main;
  now_playing: now_playing;
  popular: popular;
  upcoming: upcoming;
  genres: genres;
  iWillGo: string;
  intresting: string;
}

export interface IEvent {
  Name: string;
  Movie: string;
  Category: string;
  Datetime: string;
  Actions: string;
}


export interface IListEvent {
  Title: string;
  MovieCategory: string;
  MovieAction: string;
}

export interface IMoviesByCategory {
  now_playing: IMovie[];
  popular: IMovie[];
  upcoming: IMovie[];
}

export interface IMovie {
  id: number;
  title: string;
  rating: number;
  poster: string;
  genres: Array<string>;
}

export interface IGenre {
  id: number;
  name: string;
}