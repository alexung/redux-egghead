// === REACT TODO LIST EXAMPLE -- EXTRACTING CONTAINER COMPONENTS LIKE FilterLink ===
// === INTRO TO CONTAINER COMPONENTS ===

// filter link container component that is subscribed to the Redux chore
//

// We want to break out container component into separate pieces so that the presentational
// components don't need to know all these tidbits of data that their children need,
// bc it's not really separation of concerns

// We don't want to pass a lot of props down the tree when intermediate components don't use them
// Want to extract a few more container components, just like how we extracted the presentational components
// i.e. (footer has unnecessary attrs it's just trying to pass to filterlink)
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

// this FilterLink is in the footer and calls the store.dispatch so that footer,
// which is not really responsible for toggling links, doesn't have to

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
    // this is to look for the redux store state, NOT the react state
    const state = store.getState();

    return (
      <Link
        active={
          // it's active, so the link changes its css to be just plain text IF
          // the props.filter === state.visibilityFilter
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

// Footer is a presentational component, and is self sufficient
// =====IMPORTANT=====
// Footer component is simple and decoupled from what its child components need because
// the redux store.dispatch({}) is put into one of the children of this container
// component, rather than straight into the TodoApp component itself.

// can remove props for currentFilter onFilterClick because it's not using them..
// it's simply passing them on the FilterLink
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

// DON'T explicitly pass the object through this presentational component, rather pass it args that relate to what the DOM element needs to render so that it's not concerned about the type of whatever you pass through
const Todo = ({
  onClick,
  completed,
  text
}) => (
  // we can remove the key={todo.id} bc it's only necessary when enumerating through an arr.  we'll need it later
  <li
    // when the li is clicked, calls onClick property
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

// ===IMPORTANT===
// We're encasing this in a div because we need components to be in a single
// html root element
const AddTodo = ({
  onAddClick
}) => {
  let input;

  return (
    <div>
      <input ref={node => {
            // ref above is a function that gets the node corresponding to the ref
            // saving the value of this input to this.input
            input = node;
          }} />

      <button onClick={() => {
        onAddClick(input.value);
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

let nextTodoId = 0; // global var that we'll keep incrementing
// === IMPORTANT ===
// So we define our components above
// shove them into this TodoApp master componnet, which we call with render
// then we put in redux store.dispatch({}) into it
// We can remove props from the footer component before because it doesn't
// actually use them, it merely passes them along to FilterLink
const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text
        })
      }
    />
    <TodoList
      todos={
        getVisibleTodos(
          todos,
          visibilityFilter
        )
      }
      onTodoClick={id =>
        store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })
      }
    />
    <Footer />
  </div>
);

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