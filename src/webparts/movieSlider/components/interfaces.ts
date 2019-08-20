type warning='warning';
type main='main';

export type IWindow = warning | main;

type now_playing = 'now_playing';
type popular = 'popular';
type upcoming ='upcoming';

export type ICategory = now_playing | popular | upcoming;

type genres='genres';

export type Tkey= ICategory | genres;

interface IC{
  warning:warning;
  main:main;
  now_playing:now_playing;
  popular:popular;
  upcoming:upcoming;
  genres:genres;
}

export const C:IC={
  warning:'warning',
  main:'main',
  now_playing:'now_playing',
  popular:'popular',
  upcoming:'upcoming',
  genres:'genres'
};

export interface ILocalData{
  data:any[];
  datetime:Date;
}

export interface ITimerObj{
  key:Tkey;
  timerId:string;
}

export interface IMoviesByCategory{
  now_playing:IMovie[];
  popular:IMovie[];
  upcoming:IMovie[];
}

export interface IMovie {
  id: number;
  title:string;
  rating: number;
  poster: string;
  genres: Array<IGenre>;
}

export interface IResMovie {
  vote_count: number;
  id: number;
  video: boolean;
  vote_average: number;
  title: string;
  popularity: number;
  poster_path: string;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  backdrop_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
}

export interface IGenre {
  id: number;
  name: string;
}