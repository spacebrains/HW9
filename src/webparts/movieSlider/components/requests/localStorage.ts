import { IGenre, IMovie, Tkey, ILocalData, IEvent, IActs, C } from '../interfaces';


export const localSetData = (key: Tkey, data: IMovie[] | IGenre[]): void => {
    console.log('localSetData', key);
    const obj = {
        data: data,
        datetime: new Date()
    };

    localStorage.setItem(key, JSON.stringify(obj));
};

export const localGetData = async <T extends any[]>(key: Tkey): Promise<T> => {
    console.log('localGetData:_', key);
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






export const localGetTempEvents = async (key: string = 'tempData'): Promise<IEvent[]> => {
    console.log('localGetTempEvents:_');
    const TIMER_TIME = 900000;
    const json = localStorage.getItem(key);
    console.log('gettemp', json);
    if (json) {
        const dataObj = await JSON.parse(json) as ILocalData;
        const { data, datetime } = dataObj;
        console.log(+new Date() - +new Date(datetime) < TIMER_TIME, 'timerboolean');
        if (+new Date() - +new Date(datetime) < TIMER_TIME) {
            console.log('localDataFlagf',dataObj, data);
            return data;
        }
    }
    return undefined;
};


export const localGetTempActs = async (movieName: string, key: string = 'tempData'): Promise<IActs> => {
    console.log('localGetTempEvent:_');
    const events: IEvent[] = await localGetTempEvents(key);
    if (events) {
        const event = events.find(e => e.Movie === movieName);
        if (event) {
            const iWillGo: boolean = event.Actions.includes(C.iWillGo);
            const intresting: boolean = event.Actions.includes(C.intresting);

            const acts: IActs = {
                iWillGo: iWillGo,
                intresting: intresting
            };

            return acts;
        }
    }
};

//export const localDeleteteTempEvent=async()


export const localSetTempEvent = async (event: IEvent, key: string = 'tempData'): Promise<void> => {
    console.log('localSetTempData');
    let events: IEvent[];
    let tempEvents: IEvent[] = await localGetTempEvents(key);
    console.log('localData', tempEvents);

    if (tempEvents) {
        tempEvents = tempEvents.filter(e => e.Movie !== event.Movie);
        events = [...tempEvents, event];
    }
    else {
        events = [event];
    }
    console.log(events, tempEvents);
    const obj = {
        data: events,
        datetime: new Date()
    };

    localStorage.setItem(key, JSON.stringify(obj));
};