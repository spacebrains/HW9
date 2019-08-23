declare interface IMovieSliderWebPartStrings {
  PropertyPaneUrl: string;
  Lang:string;
  Load:string;
  Now_playing:string;
  Popular:string;
  UpComing:string;
  iWillGo:string;
  iWillNotGo:string;
  intresting:string;
  notIntresting:string;
  AtThisTime:string;
  AbsolutelyNothing:string;
}

declare module 'MovieSliderWebPartStrings' {
  const strings: IMovieSliderWebPartStrings;
  export = strings;
}
