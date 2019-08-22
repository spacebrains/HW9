type warning='warning';
type main='main';

export type IWindow = warning | main;

type now_playing = 'now_playing';
type popular = 'popular';
type upcoming ='upcoming';

export type ICategory = now_playing | popular | upcoming;

type genres='genres';

export type Tkey= ICategory | genres;

export interface IActs{
  iWillGo:boolean;
  intresting:boolean;
}

interface IC{
  warning:warning;
  main:main;
  now_playing:now_playing;
  popular:popular;
  upcoming:upcoming;
  genres:genres;
  iWillGo:string;
  intresting:string;
}

export const C:IC={
  warning:'warning',
  main:'main',
  now_playing:'now_playing',
  popular:'popular',
  upcoming:'upcoming',
  genres:'genres',
  iWillGo:'iWillGo',
  intresting:'intresting'
};


export interface ILocalData{
  data:any[];
  datetime:Date;
}

export interface IEvent{
  Name:string;
  Movie:string;
  Category:string;
  Datetime:string;
  Actions:string;
}


export interface IListEvent{
  Title:string;
  MovieCategory:string;
  MovieAction:string;
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
  genres: Array<string>;
}

export interface IUser {
  '@odata.context': string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle?: any;
  mail: string;
  mobilePhone?: any;
  officeLocation?: any;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
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

export interface IResCaml {
  'odata.type': string;
  'odata.id': string;
  'odata.etag': string;
  'odata.editLink': string;
  FileSystemObjectType: number;
  Id: number;
  ServerRedirectedEmbedUri?: any;
  ServerRedirectedEmbedUrl: string;
  ContentTypeId: string;
  Title: string;
  ComplianceAssetId?: any;
  Location?: any;
  Geolocation?: any;
  EventDate: string;
  EndDate: string;
  Description?: any;
  fAllDayEvent: boolean;
  fRecurrence: boolean;
  ParticipantsPickerId?: any;
  ParticipantsPickerStringId?: any;
  Category?: any;
  FreeBusy?: any;
  Overbook?: any;
  BannerUrl?: any;
  MovieCategory: MovieCategory[];
  MovieAction: string;
  ID: number;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
}

interface MovieCategory {
  Label: string;
  TermGuid: string;
  WssId: number;
}