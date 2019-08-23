import * as React from 'react';
import * as strings from 'MovieSliderWebPartStrings';
import styles from './Movie.module.scss';
import WarningBlock from '../WarningBlock/WarningBlock';
import { getSpListEvent, addListEvent, deleteListEvent, IResCaml } from '../requests/SpRestApi';
import { setLocalTempEvent, getLocalTempEvents } from '../requests/localStorage';
import { addOutlookEvent } from '../requests/GraphApi';
import { MSGraphClientFactory } from '@microsoft/sp-http';
import { PrimaryButton } from 'office-ui-fabric-react';
import Spinner from '../Spinner/Spinner';
import { IMovie, IActs, IWindow, IEvent } from '../interfaces';
import C from '../constants';
import Store from '../../../Observer/Observer';


interface IMovieProps {
	movie: IMovie;
	MSGClientFactory: MSGraphClientFactory;
	isLoading?: boolean;
	numberOfGenres?: number;
	userName?: string;
}

interface IState {
	movie: IMovie;
	isLoading: boolean;
	isLoadingActs: boolean;
	numberOfGenres: number;
	acts: IActs;
	window: IWindow;
	message: string;
}


export default class Movie extends React.PureComponent<IMovieProps, {}>{
	public state: IState = {
		movie: this.props.movie,
		isLoading: this.props.isLoading,
		isLoadingActs: false,
		numberOfGenres: this.props.numberOfGenres,
		acts: { iWillGo: false, intresting: false },
		window: C.warning,
		message: strings.Load
	};

	public static defaultProps: Partial<IMovieProps> = {
		isLoading: true,
		numberOfGenres: 2,
	};

	public componentDidMount(): void {
		this.setState({ ...this.state, isLoading: false, isLoadingActs: true, window: C.main });
		this.getActs();
	}

	private getActs = async (): Promise<void> => {
		try {
			let acts: IActs = await this.getLocalTempActs(this.state.movie.title);
			if (!acts) {
				acts = await this.checkMovieActs();
			}
			const newState: IState = {
				...this.state,
				acts: acts,
				window: C.main,
				isLoading: false,
				isLoadingActs: false,
			};
			this.setState(newState);
		}

		catch (error) {
			this.errorHandler(error, 'getActs');
		}
	}

	private onClickButton = async (acts: IActs) => {
		try {
			const { title, genres } = this.state.movie;
			const MovieAction = (acts.iWillGo ? `${C.iWillGo} ` : '') + (acts.intresting ? `${C.intresting} ` : '');
			const date = new Date();

			const tempEvent: IEvent = {
				Name: this.props.userName || '',
				Movie: title,
				Category: genres.join('; '),
				Datetime: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}h:${date.getMinutes()}m`,
				Actions: MovieAction
			};

			if (acts.iWillGo || acts.intresting) {
				await setLocalTempEvent(tempEvent);
				await deleteListEvent(title);
				await addListEvent(title, genres, MovieAction);
			}
			else {
				await setLocalTempEvent(tempEvent);
				await deleteListEvent(title);
			}
			addOutlookEvent(this.props.MSGClientFactory, title, MovieAction);
			Store.broadcast();
			this.setState({ ...this.state, acts: acts });
		}

		catch (error) {
			this.errorHandler(error, 'onClickButton');
		}
	}

	private checkMovieActs = async (baseUrl: string = 'https://mastond.sharepoint.com', calendarName: string = 'MovieCalendar'): Promise<IActs> => {
		const { title } = this.state.movie;
		const response: IResCaml = await getSpListEvent(title);
		if (response) {
			const iWillGo: boolean = response.MovieAction.includes(C.iWillGo);
			const intresting: boolean = response.MovieAction.includes(C.intresting);

			const acts: IActs = {
				iWillGo: iWillGo,
				intresting: intresting
			};
			return acts;
		}
		else return { iWillGo: false, intresting: false };
	}

	private getLocalTempActs = async (movieName: string, key: string = 'tempData'): Promise<IActs> => {
		const events: IEvent[] = await getLocalTempEvents(key);
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

	public render(): React.ReactElement<IMovieProps> {
		const { numberOfGenres, isLoading, isLoadingActs, message, window, acts } = this.state;
		if (window === C.main) {
			const { poster, rating } = this.state.movie;
			const { iWillGo, intresting } = acts;
			const genres = this.state.movie.genres.slice(0, numberOfGenres).filter(g => g);

			return (
				<div className={styles.Movie}>
					{isLoading ? <Spinner /> : null}
					<div className={styles.main} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w400${poster})` }}>
						<footer>
							<div className={styles.scale}>
								<div className={styles.rating} style={{ width: `${rating * 10}%` }}></div>
							</div>
							<ul className={styles.genres}> {genres.map(g => <li className={styles.genres_li}>{g}</li>)} </ul>
						</footer>
					</div>
					<div className={styles.menu}>
						{isLoadingActs ? <div className={styles.Spinner}><Spinner /></div> : null}
						<div className={styles.back}></div>
						<div className={styles.back__container}>
							<PrimaryButton
								text={iWillGo ? strings.iWillNotGo : strings.iWillGo}
								className={styles.button}
								onClick={() => this.onClickButton({ ...acts, iWillGo: !iWillGo })} />
							<PrimaryButton
								text={intresting ? strings.notIntresting : strings.intresting}
								className={styles.button}
								onClick={() => this.onClickButton({ ...acts, intresting: !intresting })}
							/>
						</div>
					</div>
				</div>
			);
		}
		else if (window === C.warning)
			return (
				<div className={styles.Movie}>
					<WarningBlock isLoading={isLoading} message={message} />
				</div>
			);
	}
}



