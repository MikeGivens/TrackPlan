import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
	state = {
		text: '',
		date: ''
	}

	handleChange = name => e => {
		const newText = e.target.value;
		this.setState({
			[name]: newText
		});
	};

	handleKeyDown = e => {
		if (e.key === 'Enter') {
			this.props.submit(this.state.text, this.state.date);
			this.setState({text: ""});
			this.setState({date: ""});
		}
	};

	render() {
		return (
			<div>
				<TextField
					onChange={this.handleChange('text')}
					onKeyDown={this.handleKeyDown}
					label="Todo Name..."
					margin="normal"
					value={this.state.text}
					fullWidth
				/>
				<TextField
					onChange={this.handleChange('date')}
					onKeyDown={this.handleKeyDown}
					label="Todo Day/Time..."
					margin="normal"
					value={this.state.date}
					fullWidth
				/>
			</div>
		);
	}
}