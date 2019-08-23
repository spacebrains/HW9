import * as React from 'react';
import * as strings from 'EventListWebPartStrings';
import { DetailsList } from "office-ui-fabric-react";
import { getEventsUsingSearchApi } from './requests/searchApi';
import { getLocalTempEventsWithTime, ILocalEventData } from './requests/localStorage';
import { IWindow, IEvent } from './interfaces';
import C from './constants';
import Store from '../../Observer/Observer';
import Spinner from './Spinner/Spinner';
import WarningBlock from './WarningBlock/WarningBlock';



export interface IEventListProps {
}


interface IState {
  window: IWindow;
  message: string;
  isLoading: boolean;
  items: IEvent[];
}


export default class EventList extends React.Component<IEventListProps, {}> {
  private timerId: number;

  public state: IState = {
    window: C.warning,
    message: strings.Load,
    isLoading: true,
    items: []
  };


  public componentDidMount(): void {
    Store.subscribe(this.getEvents);
    this.getEvents();
  }


  public getEvents = async (): Promise<void> => {
    this.setState({...this.state, isLoading:true});
    try {
      const calendarEvents = await getEventsUsingSearchApi();
      const tempEvents = await this.getTempEvents();
      let events: IEvent[] = [];

      if (calendarEvents && tempEvents) {
        events = calendarEvents.filter(e => !tempEvents.some(te => te.Movie == e.Movie));
        events = [...events, ...tempEvents];
      }
      else if (!calendarEvents && tempEvents) {
        events = tempEvents;
      }
      else if (calendarEvents && !tempEvents) {
        events = calendarEvents;
      }

      events = events.filter(e => e.Actions !== '');
      if (events.length !== 0) {
        const newState: IState = {
          ...this.state,
          items: events.filter(e => e.Actions !== ''),
          window: C.main,
          isLoading: false
        };
        this.setState(newState);
      }
      else {
        const newState: IState = {
          ...this.state,
          window: C.warning,
          message: strings.CalendarIsEmpty,
          isLoading: false
        };
        this.setState(newState);
      }
    }
    catch (error) {
      this.errorHandler(error, 'getEvents');
    }
  }


  private getTempEvents = async (): Promise<IEvent[]> => {
    try {
      const tempEventsData: ILocalEventData = await getLocalTempEventsWithTime();
      if (tempEventsData) {
        if (this.timerId) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }

        this.timerId = setTimeout(this.getEvents, tempEventsData.timerTime);
        return tempEventsData.data;
      }
    }
    catch (error) {
      this.errorHandler(error, 'getTempEvents');
    }
  }

  private errorHandler(error: Error, functionName: string = ""): void {
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