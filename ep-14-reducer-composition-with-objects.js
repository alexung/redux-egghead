// === REDUCER COMPOSITION WITH OBJECTS ===
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
        return todo;
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

// visibilityFilter function defined with 2 args:
// 1. state which defaults to 'SHOW_ALL'
// 2. action, where we look at the action.type and see which filter
// we're trying to toggle

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

const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    // combined reducers, visibilityFilter + todos work together to combine results
    // into new, single state object
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  };
};

const { createStore } = Redux;
const store = createStore(todoApp);

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})