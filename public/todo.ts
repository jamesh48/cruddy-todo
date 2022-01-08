
// Todo Model //////////////////////////////////////////////////////////////////
// @ts-ignore
window.Todo = {

  url: '/todo',

  // Create (Crud) -- collection
  create: function(text: string, callback: () => void) {
    return $.ajax({
      url: this.url,
      type: 'POST',
      dataType: 'json',
      data: {todoText: text},
      success: callback
    });
  },

  // Read all (cRud) -- collection
  readAll: function(callback: () => void) {
    return $.ajax({
      url: this.url,
      type: 'GET',
      dataType: 'json',
      success: callback
    });
  },

  // Read one (cRud) -- member
  readOne: function(id: string, callback: () => void) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: 'GET',
      dataType: 'json',
      success: callback
    });
  },

  // Update (crUd) -- member
  update: function(id: string, text: string, callback: () => void) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: 'PUT',
      dataType: 'json',
      data: {todoText: text},
      success: callback
    });
  },

  // Delete (cruD) -- member
  delete: function(id: string, callback: () => void) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: 'DELETE',
      dataType: 'json',
      success: callback
    });
  }
};
