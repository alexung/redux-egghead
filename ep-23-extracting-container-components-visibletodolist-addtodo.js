// === REDUX: EXTRACTING CONTAINER COMPONENTS LIKE VisibleTodoList and AddTodo ===
// === INTRO TO CONTAINER COMPONENTS ===

// continue extracting container components from the top level container components
// like the TodoList component.

// I want to keep the TodoList presentational component, but I want to encapsulate
// within the currently visible Todos into a separate container component that connects
// the TodoList to the redux chore.  Going to call this component the visible TodoList.

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

// Presentational component
const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

// CONTAINER COMPONENT, will display the presentational component 'link'
class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

// PRESENTATIONAL COMPONENT
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter="SHOW_ALL"
    >
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter="SHOW_ACTIVE"
     >
       Active
     </FilterLink>
     {', '}
     <FilterLink
      filter="SHOW_COMPLETED"
     >
       Completed
     </FilterLink>
  </p>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
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

let nextTodoId = 0;

// BOTH CONTAINER AND PRESENTATIONAL COMPONENT
// below is kind of combining container component AND presentational component
// but it's okay for this because we can't really envision this component
// being used for any other purpose and so reusability may be kind of pointless.
// we'll consider putting this into a different component in future
const AddTodo = () => {
  let input;

  return (
    <div>
      <input ref={node => {
            input = node;
          }} />

      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

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

// Container component, subscribes to the store and rerenders it anytime store state changes
class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return(
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
}

// none of container below needs props passed in as args, so we can remove them
// and just have an empty ()
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// ==== IMPORTANT ====
// because we've extracted the logic from each of the components we've added in
// to TodoApp, we can simply remove:
// 1. the render function that used to be here
// 2. store.subscribe(render);
// 3. render();

// because we don't need to keep track of state here, that's all being done in
// the individual components we've built

// we need this render call though!
ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);