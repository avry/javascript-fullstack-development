import React from 'react';
import ReactDOM from 'react-dom';


const App = (props) => {
	return (
		<h2 className="text-center">
			{props.headerMessage}
		</h2>
	);
};


//this validates the arguement(prop) type. Will show 
//warning otherwise
//.isRequired makes it so that if this component is called
//without this prop, a warning will show
App.propTypes = {
	headerMessage: React.PropTypes.string
};

//this sets the default values of props
App.defaultProps = {
	headerMessage: 'Hello!!'
}


ReactDOM.render(
	<App />,
	document.getElementById('root')
);