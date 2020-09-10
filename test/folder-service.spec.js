const FolderService = require('../src/folder/folder-service')
const knex = require('knex')

describe.only(`Folder service object`, function() {
    let db

    let testFolders = [
        {
            folder_id: 1,
            name: 'One'
        },
        {
            folder_id: 2,
            name: 'Two'
        },
        {
            folder_id: 3,
            name: 'Three'
        },
    ]

    //BEFORE//
    before(() => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })
    
    before(() => db('folder').truncate())

    before(() => {
        return db
            .into('folder')
            .insert(testFolders)
    })
    //AFTER//
    after(() => db.destroy())

    describe(`getAllFolders()`, () => {

        it(`resolves all folders from 'folder' table`, () => {
        // test that FolderService.getAllFolders gets data from table
        return FolderService.getAllFolders(db)
        .then(actual => {
          expect(actual).to.eql(testFolders)
        })
        })
    })
})