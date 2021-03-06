import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import CommentConstants from '../constants/CommentConstants';

const _comments = {};

function create(author, text) {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _comments[id] = {
    id: id,
    text: text,
    author: author,
    date: new Date(),
  };
}

// create dummy data
for (let i = 0; i < 2; i++) {
  create('Nate', 'This is sample comment.');
}

function destroy(id) {
  delete _comments[id];
}

const CommentStore = Object.assign({}, EventEmitter.prototype, {
  getAll() {
    const arr = [];
    for (const p in _comments) {
      arr.push(_comments[p]);
    }
    arr.sort((c1, c2) => c1.date.getTime() - c2.date.getTime());
    return arr;
  },

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(action => {
  let text;

  switch (action.actionType) {
  case CommentConstants.COMMENT_CREATE:
    text = action.text.trim();
    if (text !== '') {
      create(action.author, action.text);
      CommentStore.emitChange();
    }
    break;

  case CommentConstants.TODO_DESTROY:
    destroy(action.id);
    CommentStore.emitChange();
    break;

  default:
    // no op
  }
});

export default CommentStore;
