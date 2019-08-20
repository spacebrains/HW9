import { localGetData, localSetData } from './localStorage';
import { IGenre, IResMovie, IMovie, ICategory, C } from '../interfaces';

import * as strings from 'MovieSliderWebPartStrings';

const KEY = '57f28580932896b3e3c54cd033265039';

export const loadGenres = async (): Promise<IGenre[]> => {
    console.log('loadGenres');
    try {
        const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}&language=${strings.Lang}`;

        const response = await fetch(URL);
        const json = await response.json();
        const genresArr = json.genres;

        return genresArr;
    }
    catch (error) {
        console.error('loadGenres', error);
        return [];
    }
};

const parseMovies = async (data: IResMovie[]): Promise<IMovie[]> => {
    console.log('parseMovies');
    try {
        let genres:IGenre[] = await localGetData(C.genres);
        if (!genres || genres.length === 0) {
            genres = [...await loadGenres()];
            await localSetData(C.genres,genres);
        }

        const movies: IMovie[] = data.map(i => {
            const movie: IMovie = {
                id: i.id,
                title: i.title,
                rating: i.vote_average,
                poster: i.poster_path,
                genres: i.genre_ids.map(gI => genres.find(g => g.id === gI))
            };
            return movie;
        });
        return movies;
    }
    catch (error) {
        console.error('parseMovies', error);
    }
};

export const loadMovies = async (category: ICategory, length: number): Promise<IMovie[]> => {
    console.log('loadMovies');
    try {
        const NUMBER_OF_RESULTS = 20;

        const page = Math.floor((length / NUMBER_OF_RESULTS) + 1);
        const URL = `https://api.themoviedb.org/3/movie/${category}?api_key=${KEY}&language=${strings.Lang}&page=${page}`;

        const response = await fetch(URL);
        const json = await response.json();

        const results: IResMovie[] = json.results;
        const movies = await parseMovies(results);

        return movies;
    }
    catch (error) {
        console.error('loadMovies', error);
        return [];
    }
};