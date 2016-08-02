// === REACT TODO LIST EXAMPLE (EXTRACTING PRESENTATIONAL COMPONENTS LIKE Todo, TodoList) ===
// === INTRO TO PRESENTATIONAL COMPONENTS ===

// All in all, summary of what's happening
// 1. class TodoApp calls the TodoList component

// 2. TodoList component has an onTodoClick property that we defined as an arg
//    for the component.  Directly in the class TodoApp, we're including the
//    store.dispatch({}) where we have id being passed as an arg

// 3. TodoList calls Todo, which then will either cross out or uncross out the item
//    bc of the switch/case statements we have in const todo

// 4.
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
// below is our root reducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }

  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          // so filter knows which filter is being picked
          filter
        });
      }}
    >
      {children}
    </a>
  );
};

// extracting this from the 'class TodoApp extends Component' and creating a separate component for it
// DON'T explicitly pass the object through this presentational component, rather pass it args that relate to what the DOM element needs to render so that it's not concerned about the type of whatever you pass through
const Todo = ({
  onClick,
  completed,
  text
}) => (
  // we can remove the key={todo.id} bc it's only necessary when enumerating through an arr.  we'll need it later
  <li
    onClick={onClick}
    style={{
      textDecoration:
      completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

// we also create a TodoList to render a todo component for each todo
// === IMPORTANT ===
// because this is presentational, we don't want to hardcode logic in so we create
// an 'onTodoClick' arg which is called by the onClick, so we can customize what happens
// on click
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
         key={todo.id}
         {...todo}
         onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

let nextTodoId = 0; // global var that we'll keep incrementing
class TodoApp extends Component {
  render() {
    const {
      todos,
      visibilityFilter
    } = this.props;
    // above is so we can access the todos/visibilityFilters without this.props every time
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );
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
        <TodoList
          // here, we create a TodoList component that we defined above
          // ====IMPORTANT====
          // the args for the presentational component above are defined as attrs
          // on this react component we've created
          todos={visibleTodos}
          onTodoClick={id =>
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
          } />
        <p>
          Show:
          {' '}
          <FilterLink
            filter="SHOW_ALL"
            currentFilter={visibilityFilter}
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter="SHOW_ACTIVE"
            currentFilter={visibilityFilter}
           >
             Active
           </FilterLink>
           {' '}
           <FilterLink
            filter="SHOW_COMPLETED"
            currentFilter={visibilityFilter}
           >
             Completed
           </FilterLink>
        </p>
      </div>
    );
  }
}

// because we are subscribed via store.subscribe(render)
// every store change, the getState() is called on the <TodoApp /> component
// making sure it's up to date
const render = () => {
  ReactDOM.render(
    <TodoApp
      // this makes it so every state field in state object is passed
      // as prop to TodoApp component
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
// console.log(store.subscribe(render));
render();