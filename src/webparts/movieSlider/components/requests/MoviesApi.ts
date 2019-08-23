import { getLocalData, setLocalData } from './localStorage';
import { IGenre, IMovie, ICategory } from '../interfaces';
import C from '../constants';
import { IResMovie } from './responseInterfaces';
import * as strings from 'MovieSliderWebPartStrings';

const KEY = '57f28580932896b3e3c54cd033265039';


export interface IResMovie extends IResMovie { }

export const loadGenresFromMDB = async (): Promise<IGenre[]> => {
    const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}&language=${strings.Lang}`;
    const response = await fetch(URL);
    const json = await response.json();
    const genres = json.genres;
    return genres;
};


const parseMoviesFromMDB = async (data: IResMovie[]): Promise<IMovie[]> => {
    let genres: IGenre[] = await getLocalData(C.genres);
    if (!genres || genres.length === 0) {
        genres = [...await loadGenresFromMDB()];
        await setLocalData(C.genres, genres);
    }
    const movies: IMovie[] = data.map(i => {
        const movie: IMovie = {
            id: i.id,
            title: i.title,
            rating: i.vote_average,
            poster: i.poster_path,
            genres: i.genre_ids.map(gI => genres.find(g => g.id === gI)).map(gObj => gObj.name)
        };
        return movie;
    });
    return movies;
};


export const loadMoviesFromMDB = async (category: ICategory, length: number): Promise<IMovie[]> => {
    const NUMBER_OF_RESULTS = 20;
    const page = Math.floor((length / NUMBER_OF_RESULTS) + 1);
    const URL = `https://api.themoviedb.org/3/movie/${category}?api_key=${KEY}&language=${strings.Lang}&page=${page}`;
    const response = await fetch(URL);
    const json = await response.json();
    const results: IResMovie[] = json.results;
    const movies = await parseMoviesFromMDB(results);
    return movies;
};