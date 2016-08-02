// === REDUCER COMPOSITION WITH combineReducers() ===
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

// MUST DEFINE COMBINE REDUCERS AS BELOW BEFORE YOU USE IT
const { combineReducers } = Redux;
// IMPORTANT
// combineReducers allow you to avoid writing this code by hand and generates
// top level code for you.

// ==replace with below, they behave the same, but below is easier to write==
// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };

const todoApp = combineReducers({
  // ======
  // keys correspond with the things we append to state. (i.e. state.visibilityFilter)

  // values correspond with the reducers it should call to update the corresponding
  // fields (i.e. const visibilityFilter)

  // todos: todos,
  // visibilityFilter: visibilityFilter
  // ======
  // bc key and value names are same, with ES6 we can just call the shorthand as below:
  todos,
  visibilityFilter
});

const { createStore } = Redux;
const store = createStore(todoApp);
