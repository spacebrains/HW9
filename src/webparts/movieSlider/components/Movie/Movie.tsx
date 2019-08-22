import * as React from 'react';
import * as strings from 'MovieSliderWebPartStrings';
import styles from './Movie.module.scss';
import WarningBlock from '../WarningBlock/WarningBlock';
import { checkMovieActs, addListEvent, deleteListEvent } from '../requests/RestApi';
import { localGetTempActs, localSetTempEvent } from '../requests/localStorage';
import { addOutlookEvent } from '../requests/GraphApi';
import { PrimaryButton } from 'office-ui-fabric-react';
import Spinner from '../Spinner/Spinner';
import { IMovie, IActs, IWindow, IEvent, C } from '../interfaces';
import Store from '../../../Observer/Observer';



interface IMovieProps {
	movie: IMovie;
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
		console.log('m componentDidMount');
		this.setState({ ...this.state, isLoading: false, isLoadingActs: true, window: C.main });
		this.getActs();
	}

	/*public componentDidUpdate(prevState): void {
		console.log('m componentDidUpdate');
		if (this.state.movie !== prevState.movie) {
			this.getActs();
		}
		else this.setState({ ...this.state, isLoading: false });
	}*/

	private getActs = async (): Promise<void> => {
		console.log('m checkActs');
		try {
			let acts: IActs = await localGetTempActs(this.state.movie.title);
			console.log(acts);
			if (!acts) {
				acts = await checkMovieActs(this.state.movie.title);
				console.log(acts);
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
		console.log('m onClickButton');
		try {
			const { title, genres } = this.state.movie;

			const iWillGo = acts.iWillGo ? `${C.iWillGo}; ` : '';
			const intresting = acts.intresting ? `${C.intresting}; ` : '';
			const MovieAction = iWillGo + intresting;

			const tempEvent: IEvent = {
				Name: this.props.userName || '',
				Movie: title,
				Category: genres.join('; '),
				Datetime: `${new Date()}`,
				Actions: MovieAction
			};

			await localSetTempEvent(tempEvent);
			if (acts.iWillGo || acts.intresting) {
				await deleteListEvent(title);
				await addListEvent(title, genres, acts);
			}
			else {
				await deleteListEvent(title);
			}
			Store.broadcast();

			this.setState({ ...this.state, acts: acts });

		}
		catch (error) {
			this.errorHandler(error, 'onClickButton');
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
		console.log('m render', this.state);

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



