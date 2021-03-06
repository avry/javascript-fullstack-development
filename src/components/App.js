import React from 'react';
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from '../api';

const pushState = (obj, url) => {
	window.history.pushState(obj, '', url);
}


const onPopState = handler => {
	window.onpopstate = handler;
}


class App extends React.Component {
	static propTypes = {
		initialData: React.PropTypes.object.isRequired //the data object
	};
	state = this.props.initialData; //this.props.initialData is an object 
	componentDidMount() {
		//will perform ajax request	
		onPopState((event) => {
			this.setState({
				currentContestId: (event.state || {}).currentContestId //if event.state is undefined, then there is no currentContestId
			});
		}); 
	}


	componentWillUnmount() {
		//clean timers, listeners
		onPopState(null);
	}


	fetchContest = (contestId) => {
		pushState(
			{ currentContestId: contestId },
			`/contest/${contestId}`
		);
		api.fetchContest(contestId).then(contest => {
			this.setState({
				currentContestId: contest._id,
				contests: {
					...this.state.contests,
					[contest._id]: contest
				}
			});
		});
	};


	fetchContestList = () => {
		pushState(
			{ currentContestId: null },
			`/`
		);
		api.fetchContestList().then(contest => {
			console.log("it is done");
			this.setState({
				currentContestId: null,
				contest 
			});
		});
	};


	fetchNames = (nameIds) => {
		if (nameIds.length === 0) {
			return;
		}
		api.fetchNames(nameIds).then(names => {
			this.setState({
				names
			});
		});
	};
 
	lookupName = (nameId) => {
		if (!this.state.names || !this.state.names[nameId]) {
			return {
				name: '...'
			};
		}
		return this.state.names[nameId];
	}


	currentContest() {
		return this.state.contests[this.state.currentContestId];
	}


	pageHeader() {
		//returns header
		if (this.state.currentContestId) {
			return this.currentContest().contestName;
		}
		return 'Naming Contests';
	}

	addName = (newName, contestId) => {
		api.addName(newName, contestId).
			then(resp => 
				this.setState({
					contests: {
						...this.state.contests,
					 	[resp.updatedContest._id]: resp.updatedContest,//this is a dynamic id						
					},
					names: {
						...this.state.names,
						[resp.newName._id]: resp.newName
					}

				})
			)
			.catch(console.error);
	};

// currentContestId: apiData.id,
// contests: {[apiData.id]: apiData}

	currentContent() {
		if (this.state.currentContestId) {
			return <Contest 
				contestListClick={this.fetchContestList}
				fetchNames={this.fetchNames} 
				lookupName={this.lookupName}
				addName={this.addName}
				{...this.currentContest()} />; //shallow cloning via the spread operator
		}
		return <ContestList 
			onContestClick={this.fetchContest}
			contests={this.state.contests} />;

	}


	render() {
		return (
			<div className="App">
				<Header message={this.pageHeader()} />
				{this.currentContent()}
			</div>
		);
	}
}
 
export default App;