import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import EventList from './components/EventList';
import { IEventListProps } from './components/EventList';

export interface IEventListWebPartProps {
  calendarId: string;
  connectToggle: boolean;
}

export default class EventListWebPart extends BaseClientSideWebPart<IEventListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEventListProps> = React.createElement(
      EventList
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
