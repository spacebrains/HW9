export interface ILocalData {
    data: any[];
    datetime: number;
}

export interface ILocalEventData {
    data: any[];
    timerTime: number;
}


export const getLocalTempEventsWithTime = async (key: string = 'tempData'): Promise<ILocalEventData> => {
    const TIMER_TIME = 900000;
    const json = localStorage.getItem(key);
    if (json) {
        const localData = await JSON.parse(json) as ILocalData;
        if (+new Date() - +new Date(localData.datetime) < TIMER_TIME) {

            return { data: localData.data, timerTime: ((localData.datetime + TIMER_TIME) - (+ new Date())) };
        }
    }
};