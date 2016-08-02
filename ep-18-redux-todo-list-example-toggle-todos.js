// === REACT TODO LIST EXAMPLE (TOGGLE A TODO) ===
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

let nextTodoId = 0; // global var that we'll keep incrementing
class TodoApp extends Component {
  render() {
    return (
      <div>
        <input ref={node => {
          // ref above is a function that gets the node corresponding to the ref
          // saving the value of this input to this.input
          this.input = node;
        }} />

        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            // text below references the input above
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo =>
            // key is the todo.id
            <li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }};
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            }}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

// every store change, the getState() is called on the <TodoApp /> component
// making sure it's up to date
const render = () => {
  ReactDOM.render(
    <TodoApp
      todos={store.getState().todos}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
console.log(store.subscribe(render));
render();