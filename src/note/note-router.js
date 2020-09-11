const path = require('path');
const express = require('express');
const NoteService = require('./note-service');
const NoteRouter = express.Router();
const jsonParser = express.json();
const {sanitizeFields} = require('../utils');

NoteRouter
  .route('/')
  .get(async (req, res, next) => {
    const db = req.app.get('db');
    try {
      const notes = await NoteService.list(db);
      res.json(notes);
    } catch(err) {
      next(err);
    } 
  })
  .post(jsonParser, async (req, res, next) => {
    console.log('demo');
    const db = req.app.get('db');
    const { name, content, folder_id } = req.body;
    let newNote = {name, content, folder_id};
    console.log("newNote",newNote)

    for (const [key, value] of Object.entries(newNote)) {
      if (value === null) {
        return next({status: 400, message: `Missing '${key}' in request body`});
      }
    }

    newNote = sanitizeFields(newNote);
    try {
      console.log('before note');
      const note = await NoteService.insert(db, newNote);
      
      console.log('after await')
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.id}`))
        .json(note);
    } catch(err){
      next(err);
    }
  })
;

NoteRouter
  .route('/:note_id')
  .all(async (req, res, next) => {
    try {
      const note = await NoteService.findById(req.app.get('db'), req.params.note_id);
      if (!note) {
        return next({status: 404, message: 'Note doesn\'t exist'});
      }
      res.note = note;
      next();
    } catch(err) {
      next(err);
    }
  })
  .get((req, res, next) => {
    res.json(res.note);
  })
  .delete(async (req, res, next) => {
    try {
      await NoteService.delete(req.app.get('db'), req.params.note_id);
      res.status(200).json({});
    } catch(err) {
      next(err);
    }
  })
;
  

module.exports = NoteRouter;