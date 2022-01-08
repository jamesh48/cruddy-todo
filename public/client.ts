$(() => {

  // View ////////////////////////////////////////////////////////////////////////

  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
    </li>
  `);

  var renderTodo = (todo: string) => {
    return template(todo);
  };

  var addTodo = (todo: string) => {
    $('#todos').append(renderTodo(todo));
  };

  var changeTodo = (id: string, todo: string) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id: string) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos: string[]) => {
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (_event) => {
    // @ts-ignore
    var text: string = $('#form input').val().trim();
    if (text) {
      // @ts-ignore
      Todo.create(text, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    if ($(event.target).data('action') === 'edit') {
      // @ts-ignore
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          // @ts-ignore
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else {
      // @ts-ignore
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  // @ts-ignore
  Todo.readAll(addAllTodos);

});
