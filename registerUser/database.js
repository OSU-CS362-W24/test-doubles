const crypto = require("node:crypto")

/*
 * This module is designed to simulate a real database implementation.  This
 * is not supposed to be a test double but rather is designed to let us use
 * something like a database without the heaviness of a real database
 * implementation.
 */
module.exports = {
    save: function save(record) {
        /*
         * Assume this function correctly saves the given record into the
         * database returns a generated ID for the record, which we simulate
         * here by generating a random ID.
         */
        console.log("== Real Database.save() executing...")
        const id = crypto.randomBytes(8).toString("hex")
        return id
    }
}
