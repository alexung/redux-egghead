// === REACT TODO LIST EXAMPLE (EXTRACTING PRESENTATIONAL COMPONENTS LIKE AddTodo, Footer, FilterLink) ===
// === INTRO TO PRESENTATIONAL COMPONENTS ===
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
  children,
  onClick
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }

  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
};

const Footer = ({
  visibilityFilter,
  onFilterClick
}) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter="SHOW_ALL"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter="SHOW_ACTIVE"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
     >
       Active
     </FilterLink>
     {', '}
     <FilterLink
      filter="SHOW_COMPLETED"
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
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
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }
    />
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