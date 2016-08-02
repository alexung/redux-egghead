// === THIS IS A REDUCER, ADD TODO ===

// todos takes an action and basically (doesn't mutate) but puts it into the
// state arr, with completed: false because you just added the todo item

const todos = (state = [], action) => {
  // the action.type, ADD_TODO, that we have below matches the case statement
  // spread operator combines state and the action into a new arr of objects
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    default:
      return state;
  }
};

const testAddTodo = () => {
  const stateBefore = [];
  // actions on reducers are the new object you want to replace the old one with
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ]

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
};

testAddTodo();
console.log('All tests passed.');