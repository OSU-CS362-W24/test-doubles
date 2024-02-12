const bcrypt = require("bcryptjs")

const Database = require("./database")

/*
 * This function "registers" a user, saving a record of the user in the
 * database.  As a security measure, the user's password is hashed and salted
 * using the bcryptjs module before it is stored in the password.  If you're
 * curious about password hashing/salting, here's a good article about it:
 *
 * https://auth0.com/blog/hashing-passwords-one-way-road-to-security/
 *
 * If the user's information was successfully stored in the database, this
 * function returns the unique ID that was generated for that user by the
 * database.  Otherwise, it returns null.
 *
 * Note that this is a "server-side" function, not a client-side application,
 * so we *don't* want to test it in the JSDOM environment.
 */
module.exports = function registerUser(email, password) {
    const record = {
        email: email,
        password: bcrypt.hashSync(password, 8)
    }
    try {
        const userId = Database.save(record)
        return userId
    } catch {
        return null
    }
}
