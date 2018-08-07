import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
	state = {
		text: '',
        calories: '',
        fat: '',
        carbs: '',
        protein: ''
	}

	handleChange = name => e => {
		const newText = e.target.value;
		this.setState({
			[name]: newText
		});
	};

	handleKeyDown = e => {
		if (e.key === 'Enter') {
			this.props.submit(this.state.text, this.state.calories, this.state.fat, this.state.carbs, this.state.protein);
			this.setState({text: ""});
            this.setState({calories: ""});
            this.setState({fat: ""});
            this.setState({carbs: ""});
            this.setState({protein: ""});
		}
	};

	render() {
		return (
			<div>
				<TextField
					onChange={this.handleChange('text')}
					onKeyDown={this.handleKeyDown}
					label="Food Name..."
					margin="normal"
					value={this.state.text}
					fullWidth
				/>
				<TextField
					onChange={this.handleChange('calories')}
					onKeyDown={this.handleKeyDown}
					label="Calories..."
					margin="normal"
					value={this.state.calories}
					fullWidth
				/>
                <TextField
					onChange={this.handleChange('fat')}
					onKeyDown={this.handleKeyDown}
					label="Fat (g)..."
					margin="normal"
					value={this.state.fat}
					fullWidth
				/>
                <TextField
					onChange={this.handleChange('carbs')}
					onKeyDown={this.handleKeyDown}
					label="Carbs (g)..."
					margin="normal"
					value={this.state.carbs}
					fullWidth
				/>
                <TextField
					onChange={this.handleChange('protein')}
					onKeyDown={this.handleKeyDown}
					label="Protein (g)..."
					margin="normal"
					value={this.state.protein}
					fullWidth
				/>
			</div>
		);
	}
}