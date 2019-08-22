import * as React from 'react';
import styles from './EventList.module.scss';
import * as strings from 'EventListWebPartStrings';
import { IEventListProps } from './IEventListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DetailsList } from "office-ui-fabric-react";
import { loadEvents } from './requests/searchApi';
import { getLocalTempEventsWithTime, ILocalData } from './requests/localStorage';
import Store from '../../Observer/Observer';
import { IWindow, IEvent, C } from './interfaces';
import Spinner from './Spinner/Spinner';
import WarningBlock from './WarningBlock/WarningBlock';




interface IState {
  window: IWindow;
  message: string;
  isLoading: boolean;
  items: IEvent[];
}


export default class EventList extends React.Component<IEventListProps, {}> {
  private timerId;

  public state: IState = {
    window: C.warning,
    message: strings.Load,
    isLoading: true,
    items: []
  };


  public componentDidMount(): void {
    console.log('e componentDidMount');
    Store.subscribe(this.getEvents);
    this.getEvents();
  }

  public getEvents = async (): Promise<void> => {
    console.log('e getEvents');
    try {
      const calendarEvents = await loadEvents();
      if (calendarEvents) {
        const tempEvents = await this.getTempEvents();
        let events: IEvent[];
        if (tempEvents) {
          events = calendarEvents.filter(e => tempEvents.every(te => te.Movie !== e.Movie));
        }
        else {
          events = calendarEvents;
        }
        console.log(calendarEvents, tempEvents);


        console.log(events);
        const newState: IState = {
          ...this.state,
          items: [...events, ...tempEvents],
          window: C.main,
          isLoading: false
        };
        this.setState(newState);
      }
    }
    catch (error) {
      this.errorHandler(error, 'e getEvents');
    }
  }

  private getTempEvents = async (): Promise<IEvent[]> => {
    console.log('e getTempEvents');
    try {
      const tempEventsData: ILocalData = await getLocalTempEventsWithTime();
      if (tempEventsData.data) {
        if (this.timerId) clearTimeout(this.timerId);
        console.log("datetime", +tempEventsData.datetime);
        this.timerId = setTimeout(this.getEvents, +tempEventsData.datetime);
        return tempEventsData.data;
      }
      else return [];
    }
    catch (error) {
      this.errorHandler(error, 'e getEvents');
    }
  }

  private errorHandler(error: Error, functionName: string = ""): void {
    console.log('e errorHandler');
    console.error(functionName, error);
    const newState: IState = {
      ...this.state,
      isLoading: false,
      window: C.warning,
      message: error.message
    };
    this.setState(newState);
  }

  public componentWillUnmount() {
    if (this.timerId) clearTimeout(this.timerId);
    Store.unsubscribe(this.getEvents);
  }


  public render(): React.ReactElement<IEventListProps> {
    console.log('e render');
    const { items, message, window, isLoading } = this.state;
    if (window === C.main) {
      return (
        <div>
          {isLoading ? <Spinner /> : ''}
          <DetailsList items={items} />
        </div>
      );
    }
    else if (window === C.warning) {
      return (
        <WarningBlock message={message} isLoading={isLoading} />
      );
    }
  }
}