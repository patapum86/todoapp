/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/chats              ->  index
 * POST    /api/chats              ->  create
 * GET     /api/chats/:id          ->  show
 * PUT     /api/chats/:id          ->  update
 * DELETE  /api/chats/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import chat from './chat.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
        .then(updated => {
        return updated;
  });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
          .then(() => {
          res.status(204).end();
    });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of chats
export function index(req, res) {
  if(req.query.filterByName) {
    var filter = { task: req.query.filterByName };
    return chat.find(filter).exec()
      .then(respondWithResult(res))
      .catch(handleError(res));

  }
  return chat.find().sort(req.query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

}


// Gets a single chats from the DB
export function show(req, res) {
  return chat.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new chats in the DB
export function create(req, res) {
  return chat.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing chats in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return chat.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a chats from the DB
export function destroy(req, res) {
  return chat.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
