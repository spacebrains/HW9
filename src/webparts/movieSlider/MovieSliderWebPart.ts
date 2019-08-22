import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from 'MovieSliderWebPartStrings';
import MovieSlider from './components/MovieSlider';
import { IMovieSliderProps } from './components/MovieSlider';
export interface IMovieSliderWebPartProps {
  basicUrl: string;
  calendarName:string;
}

export default class MovieSliderWebPart extends BaseClientSideWebPart<IMovieSliderWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMovieSliderProps> = React.createElement(
      MovieSlider,
      {
        basicUrl: this.properties.basicUrl || this.context.pageContext.web.absoluteUrl,
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('basicUrl', {
                  label: strings.PropertyPaneUrl
                }),
                PropertyPaneTextField('calendarName', {
                  label: strings.PropertyPaneUrl
                })

              ]
            }
          ]
        }
      ]
    };
  }

}
