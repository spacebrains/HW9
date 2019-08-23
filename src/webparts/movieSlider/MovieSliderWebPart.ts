import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import MovieSlider from './components/MovieSlider';
import { IMovieSliderProps } from './components/MovieSlider';


export default class MovieSliderWebPart extends BaseClientSideWebPart<{}> {

  public render(): void {
    const element: React.ReactElement<IMovieSliderProps> = React.createElement(
      MovieSlider,
      {
        MSGClientFactory: this.context.msGraphClientFactory
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
