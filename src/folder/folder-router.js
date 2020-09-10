const path = require('path');
const express = require('express');
const FolderService = require('./folder-service');
const FolderRouter = express.Router();
const jsonParser = express.json();
const {sanitizeFields} = require('../utils');
const xss = require('xss')
const uuid = require

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.name)
});

FolderRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FolderService.list(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(jsonParser, async (req, res, next) => {
    const db = req.app.get('db');
    const { name } = req.body;
    let newFolder = {name};

    for (const [key, value] of Object.entries(newFolder)) {
      if (value === null) {
        return next({status: 400, message: `Missing '${key}' in request body`});
      }
    }

    newFolder = sanitizeFields(newFolder);
    try {
      const folder = await FolderService.insert(db, newFolder);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .json(folder);
    } catch(err){
      next(err);
    }
  })
;

FolderRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FolderService.findById(req.app.get('db'), req.params.folder_id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: 'No matching folder' }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })


module.exports = FolderRouter;
