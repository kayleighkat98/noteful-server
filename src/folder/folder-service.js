const FolderService = {
    list(knex) {
        return knex.select('*').from('folder')
    },
    insert(knex, newFolder) {
        return knex
          .insert(newFolder)
          .into('folder')
          .returning('*')
          .then(rows => {
            return rows[0]
        })
    },
    
      findById(knex, folder_id) {
        return knex
          .from('folder')
          .select('*')
          .where({folder_id})
          .first('*')
      },
      delete(knex, folder_id) {
        return knex('folder')
          .where({ folder_id })
          .delete()
      },

}

module.exports = FolderService