import { IGenre, IMovie, Tkey, IEvent } from '../interfaces';


export interface ILocalData {
    data: any[];
    datetime: number;
}

export const setLocalData = (key: Tkey, data: IMovie[] | IGenre[]): void => {
    const obj = {
        data: data,
        datetime: +new Date()
    };

    localStorage.setItem(key, JSON.stringify(obj));
};

export const getLocalData = async <T extends any[]>(key: Tkey): Promise<T> => {
    const TIMER_TIME = 86400000;
    const json = localStorage.getItem(key);
    if (json) {
        const { data, datetime } = await JSON.parse(json) as ILocalData;
        if (+new Date() - +new Date(datetime) < TIMER_TIME) {
            return data as T;
        }
    }
    return [] as T;
};



export const getLocalTempEvents = async (key: string = 'tempData'): Promise<IEvent[]> => {
    const TIMER_TIME = 900000;

    const json = localStorage.getItem(key);
    if (json) {
        const dataObj = await JSON.parse(json) as ILocalData;
        const { data, datetime } = dataObj;
        if (+new Date() - +new Date(datetime) < TIMER_TIME) {
            return data;
        }
    }
    return undefined;
};

export const deleteLocalTempEvent = async (event: IEvent, key: string = 'tempData') => {
    let tempEvents: IEvent[] = await getLocalTempEvents(key);
    if (tempEvents) {
        tempEvents = tempEvents.filter(e => e.Movie !== event.Movie);
        const obj = {
            data: tempEvents,
            datetime: +new Date()
        };
        localStorage.setItem(key, JSON.stringify(obj));
    }
};


export const setLocalTempEvent = async (event: IEvent, key: string = 'tempData'): Promise<void> => {
    let events: IEvent[];
    let tempEvents: IEvent[] = await getLocalTempEvents(key);

    if (tempEvents) {
        tempEvents = tempEvents.filter(e => e.Movie !== event.Movie);
        events = [...tempEvents, event];
    }
    else {
        events = [event];
    }
    const obj = {
        data: events,
        datetime: +new Date()
    };
    localStorage.setItem(key, JSON.stringify(obj));
};