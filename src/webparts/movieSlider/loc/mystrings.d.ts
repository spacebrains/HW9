declare interface IMovieSliderWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  Lang:string;
  Load:string;
  Now_playing:string;
  Popular:string;
  UpComing:string;
}

declare module 'MovieSliderWebPartStrings' {
  const strings: IMovieSliderWebPartStrings;
  export = strings;
}
