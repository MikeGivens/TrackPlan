const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test7');

const Todo = mongoose.model('Todo', {
	text: String,
	date: String,
	complete: Boolean
});

const Food = mongoose.model('Food', {
	text: String,
	calories: String,
	fat: String,
	carbs: String,
	protein: String
});


const typeDefs = `	
  type Query {
		todos: [Todo],
		foods: [Food]
	}
  type Todo {
	  id: ID!
		text: String!
		date: String!
	  complete: Boolean!
	}
	type Food {
		id: ID!
		text: String!
		calories: String!
		fat: String!
		carbs: String!
		protein: String!
	}
  type Mutation {
	  createTodo(text: String!, date: String!): Todo
	  updateTodo(id: ID!, complete: Boolean!): Boolean
		removeTodo(id: ID!): Boolean
		
		createFood(text: String!, calories: String!, fat: String!, carbs: String!, protein: String!): Food
		removeFood(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
		todos: () => Todo.find(),
		foods: () => Food.find()
	},
  Mutation: {
	  createTodo: async (_, {text, date}) => {
			console.log(text);
			console.log(date);
		  const todo = new Todo({text, date, complete: false});
		  await todo.save();
		  return todo;
	  },
	  updateTodo: async (_, {id, complete}) => {
		  await Todo.findByIdAndUpdate(id, {complete});
		  return true;
	  },
	  removeTodo: async (_, {id}) => {
			await Todo.findByIdAndRemove(id);
			return true;
		},
		createFood: async (_, {text, calories, fat, carbs, protein}) => {
			console.log(text);
		  const food = new Food({text, calories, fat, carbs, protein});
		  await food.save();
		  return food;
		},
		removeFood: async (_, {id}) => {
			await Food.findByIdAndRemove(id);
			return true;
		}
  }
};

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once('open', function() {
	server.start(() => console.log('Server is running on localhost:4000'))
});

