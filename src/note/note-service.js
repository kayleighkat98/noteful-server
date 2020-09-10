const NoteService = {
    list(knex) {
        return knex.select('*').from('note')
    },
    insert(knex, newNote) {
        return knex
          .insert(newNote)
          .into('note')
          .returning('*')
          .then(rows => {
            return rows[0]
        })
    },
    
      findById(knex, note_id) {
        return knex
          .from('note')
          .select('*')
          .where({note_id})
          .first('*')
      },
    
      delete(knex, note_id) {
        return knex('note')
          .where({ note_id })
          .delete()
      },
    
      updateNote(knex, note_id, newNoteFields) {
        return knex('note')
          .where({ note_id })
          .update(newNoteFields)
      },
}

module.exports = NoteService