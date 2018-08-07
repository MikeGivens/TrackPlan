import React, { Component } from 'react';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';

import Form from './Form';
import FormFoods from './FormFoods';

const Queries = gql`
{
	todos {
		id
		text
		date
		complete
	}
	foods {
		id
		text
		calories
		fat
		carbs
		protein
	}
}
`;

const TodosQuery = gql`
{
	todos {
		id
		text
		date
		complete
	}
}
`;

const FoodsQuery = gql`
{
	foods {
		id
		text
		calories
		fat
		carbs
		protein
	}
}
`;

const UpdateTodoMutation = gql`
	mutation($id: ID!, $complete: Boolean!) {
		updateTodo(id: $id, complete: $complete)
	}
`;

const RemoveTodoMutation = gql`
	mutation($id: ID!) {
		removeTodo(id: $id)
	}
`;

const CreateTodoMutation = gql`
	mutation($text: String!, $date: String!) {
		createTodo(text: $text, date: $date) {
			id
			text
			date
			complete
		}
	}
`;

const CreateFoodMutation = gql`
	mutation($text: String!, $calories: String!, $fat: String!, $carbs: String!, $protein: String!) {
		createFood(text: $text, calories: $calories, fat: $fat, carbs: $carbs, protein: $protein) {
			id
			text
			calories
			fat
			carbs
			protein
		}
	}
`;

const RemoveFoodMutation = gql`
	mutation($id: ID!) {
		removeFood(id: $id)
	}
`;

class App extends Component {
	updateTodo = async todo => {
		await this.props.updateTodo({
			variables: {
				id: todo.id,
				complete: !todo.complete
			},
            update: store => {
				const data = store.readQuery({ query: TodosQuery });
				data.todos = data.todos.map(
					x => 
						x.id === todo.id 
							? {
								...todo,
							complete: !todo.complete
							}
					: x
				);
				store.writeQuery({ query: TodosQuery, data });
            }
		});
	};

	removeTodo = async todo => {
		await this.props.removeTodo({
			variables: {
				id: todo.id,
			},
            update: store => {
				const data = store.readQuery({ query: TodosQuery });
				data.todos = data.todos.filter(x => x.id !== todo.id);
				store.writeQuery({ query: TodosQuery, data });
            }
		});
	};

	createTodo = async (text, date) => {
		await this.props.createTodo({
			variables: {
				text,
				date,
			},
            update: (store, {data: { createTodo } }) => {
				const data = store.readQuery({ query: TodosQuery });
				data.todos.unshift(createTodo);
				store.writeQuery({ query: TodosQuery, data });
            }
		});
	}

	createFood = async (text, calories, fat, carbs, protein) => {
		await this.props.createFood({
			variables: {
				text,
				calories,
				fat,
				carbs,
				protein
			},
            update: (store, {data: { createFood } }) => {
				const data = store.readQuery({ query: FoodsQuery });
				data.foods.unshift(createFood);
				store.writeQuery({ query: FoodsQuery, data });
            }
		});
	}
	
	removeFood = async food => {
		await this.props.removeFood({
			variables: {
				id: food.id,
			},
            update: store => {
				const data = store.readQuery({ query: FoodsQuery });
				data.foods = data.foods.filter(x => x.id !== food.id);
				store.writeQuery({ query: FoodsQuery, data });
            }
		});
	};

	render() {
		console.log(this.props)
		const {data: {loading, todos, foods}} = this.props;
		if (loading) {
			return null;
		}

		var caloriesTotal = 0;
		var fatTotal = 0;
		var proteinTotal = 0;
		var carbsTotal = 0;
		for (let i = 0; i < foods.length; i++) {
			caloriesTotal += parseInt(foods[i].calories);
			fatTotal += parseInt(foods[i].fat);
			proteinTotal += parseInt(foods[i].protein);
			carbsTotal += parseInt(foods[i].carbs);
		}
		return (
		<div style={{display: 'flex'}}>
			<div className='container'>
				<h1 style={{color: 'white', textAlign: 'center'}}>Welcome to TrackPlan</h1>
				<p style={{color: 'white'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam egestas, enim at finibus suscipit, justo ante efficitur ligula, sed efficitur felis dui quis ante. Sed ornare accumsan elit vel ultricies. Quisque ac tellus et sem fermentum ultricies sed eu neque. Donec fringilla nibh est, pellentesque faucibus leo elementum at. In quis egestas quam, vel suscipit purus. Ut vel aliquam dolor. Curabitur elementum facilisis aliquet.</p><br />
				<h2 style={{color: 'white', float: 'right', marginRight: '100px'}}>Todo List</h2>
				<h2 style={{color: 'white', float: 'left', marginLeft: '250px',}}>Dietary Table</h2>
				<p style={{color: 'white', float: 'right', marginRight: '60px', clear: 'both'}}>Insert upcoming tasks here!</p>
				<p style={{color: 'white', float: 'left', marginLeft: '210px',}}>Insert information for foods eaten here!</p>
				<div style={{margin: 'auto', width: 325, float: 'right', clear: 'both'}}>
					<Paper elevation={1}>
						<Form submit={this.createTodo}/>
						<List>
							{todos.map(todo => (
								<ListItem
									key={todo.id}
									role={undefined}
									dense
									button
									onClick={() => this.updateTodo(todo)}
								>
								<Checkbox
									checked={todo.complete}
									tabIndex={-1}
								/>
								<ListItemText primary={todo.text} secondary={todo.date} />
								<ListItemSecondaryAction>
									<IconButton onClick={() => this.removeTodo(todo)}>
										<CloseIcon />
									</IconButton>
								</ListItemSecondaryAction>
								</ListItem>	
							))}
						</List>
					</Paper>
				</div>
				<div style={{ margin: 'auto', width: 700, float: 'left', display:'inline-block'}}>
					<Paper elevation={1}>
						<FormFoods submit={this.createFood}/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Food Name</TableCell>
									<TableCell numeric>Calories</TableCell>
									<TableCell numeric>Fat (g)</TableCell>
									<TableCell numeric>Carbs (g)</TableCell>
									<TableCell numeric>Protein (g)</TableCell>
									<TableCell numeric>Delete?</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{foods.map(food => {
									return (
									<TableRow key={food.id}>
										<TableCell component="th" scope="row">
											{food.text}
										</TableCell>
										<TableCell numeric>{food.calories}</TableCell>
										<TableCell numeric>{food.fat}</TableCell>
										<TableCell numeric>{food.carbs}</TableCell>
										<TableCell numeric>{food.protein}</TableCell>
										<TableCell>
											<IconButton onClick={() => this.removeFood(food)}>
                        						<DeleteIcon />
											</IconButton>
                      					</TableCell>
									</TableRow>
									);
								})}
							<TableRow>
								<TableCell component="th" scope="row"><b>Totals</b></TableCell>
								<TableCell numeric><b>{caloriesTotal}</b></TableCell>
								<TableCell numeric><b>{fatTotal}</b></TableCell>
								<TableCell numeric><b>{carbsTotal}</b></TableCell>
								<TableCell numeric><b>{proteinTotal}</b></TableCell>
								<TableCell padding="checkbox">
                      			</TableCell>
							</TableRow>	
							</TableBody>
						</Table>
					</Paper>
				</div>
			</div>
		</div>
		);
	}
}

export default compose(
	graphql(CreateTodoMutation, {name: 'createTodo'}),
	graphql(RemoveTodoMutation, {name: 'removeTodo'}),
	graphql(UpdateTodoMutation, {name: 'updateTodo'}),
	graphql(CreateFoodMutation, {name: 'createFood'}),
	graphql(RemoveFoodMutation, {name: 'removeFood'}), 
	graphql(Queries)
)(App);
