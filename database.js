import mysql from 'mysql2'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD ,
    database: process.env.MYSQL_DATABASE 
}).promise()

export const getNotes = async () => {
    const [row] = await pool.query('select * from notes')
    return row
}

export const getNote = async (id) => {
    const [row] = await pool.query(`
        SELECT * FROM notes
        WHERE id = ?`, [id])
    return row[0]
}

export const createNote = async(title, contents) => {
    const [result] = await pool.query(`
        INSERT INTO notes (title, contents)
        VALUES (?,?)
        `, [title, contents])

    return getNote(result.insertId)
}
export const EditNote = async (title, contents, id) => {
    const [result] = await pool.query(`
        UPDATE notes
        SET title = ?, contents = ?
        WHERE id = ?
    `, [title, contents, id]);

    return getNote(id);
};

export const deleteNote = async (id) => {
    await pool.query(`
        DELETE FROM notes WHERE id = ?
    `, [id]);
};
