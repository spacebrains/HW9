type warning = 'warning';
type main = 'main';

export type IWindow = warning | main;

export interface IC {
  warning: warning;
  main: main;
}

export interface IEvent{
  Name:string;
  Movie:string;
  Category:string;
  Datetime:string;
  Actions:string;
}