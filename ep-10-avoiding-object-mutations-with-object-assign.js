const toggleTodo = (todo) => {
  // this is mutating, however, and won't work with redux
  // todo.completed = !todo.completed;
  // return todo;

  // can avoid this, by creating a new object with every field created from
  // the previous object

  // return {
  //   id: todo.id,
  //   text: todo.text,
  //   completed: !todo.completed
  // };

  // BUT if we later add new properties to todo object, we might
  // forget to update this above. NOT the best implementation

  // return Object.assign({}, todo, {
  //   completed: !todo.completed
  // });

  // left most arg is the target object that's going to be mutated (it's just an empty hash)
  // second arg copies those properties into the empty hash we have
  // Object.assign() is a new ES6 syntax, and can break your site on some browsers
  // Polyfill can be used w/o risking crashing the website

  // can also use spread operator via, which will copy over old todo into new object,
  // with completed prop changed
  return {
    ...todo,
    completed: !todo.completed
  };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };

  // because of this deepFreeze, the test below breaks
  // bc you can't mutate todoBefore
  deepFreeze(todoBefore);

  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};

testToggleTodo();
console.log('All tests passed.');