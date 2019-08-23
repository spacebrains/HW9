import { IEvent } from '../interfaces';
import { ISearchResponse } from './responseInterfaces';



const parseEvents = (response: ISearchResponse): IEvent[] => {
    const resultRows = response.PrimaryQueryResult.RelevantResults.Table.Rows;
    const resultRowsWithTerms = resultRows.filter(rows => rows.Cells.find(obj => obj.Key === 'RefinableString03').Value);
    if (resultRowsWithTerms && resultRowsWithTerms.length !== 0) {
        const events: IEvent[] = resultRowsWithTerms.map(rows => {
            const Movie = rows.Cells.find(obj => obj.Key === 'Title').Value;
            const Category = rows.Cells.find(obj => obj.Key === 'RefinableString05').Value;
            const Name = rows.Cells.find(obj => obj.Key === 'Author').Value;
            const date = new Date(rows.Cells.find(obj => obj.Key === 'EndDateOWSDATE').Value);
            const Datetime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}h:${date.getMinutes()}m`;
            const Actions = rows.Cells.find(obj => obj.Key === 'RefinableString03').Value;
            return { Name, Movie, Category, Datetime, Actions };
        });
        return events;
    }
};

export const getEventsUsingSearchApi = async (): Promise<IEvent[]> => {
    const baseUrl = 'https://mastond.sharepoint.com/';
    const SharePointQueryable = "_api/search/query?querytext='842EC07B-BFA0-4C58-8A5D-AB8C12ADF927'&startrow=1&selectproperties='RefinableString03%2cTitle%2c+EndDateOWSDATE%2cAuthor%2cRefinableString05'&clienttype='ContentSearchRegular'";
    const SP = (await import("@pnp/sp"));
    const WEB = new SP.Web(baseUrl, SharePointQueryable);
    const response: ISearchResponse = await WEB.get();
    const events = await parseEvents(response);

    return events;
};
