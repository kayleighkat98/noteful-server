const NoteService = require('../src/note-service')
const knex = require('knex')

describe(`Note service object`, function() {
    let db

    let testNotes = [
        {
            name: 'One',
            content: 'Content of note one',
            folder_id: '1'
        },
        {
            name: 'Two',
            content: 'Content of note two',
            folder_id: '2'
        },
        {
            name: 'Third test post!',
            content: 'Content of note three',
            folder_id: '3'
        },
    ]
    //BEFORE//
    before(() => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })
    before(() => {
        return db
            .into('note')
            .insert(testNotes)
    })

    //AFTER//
    after(() => db.destroy())

    describe(`getAllNotes()`, () => {

        it(`resolves all notes from 'note' table`, () => {
        // test that NoteService.getAllNotes gets data from table
            return NoteService.getAllNotes(db)
                .then(actual => {
                expect(actual).to.eql(testNotes)
            })
        })
    })
})