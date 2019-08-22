declare interface IEventListWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  Load:string;

}

declare module 'EventListWebPartStrings' {
  const strings: IEventListWebPartStrings;
  export = strings;
}
