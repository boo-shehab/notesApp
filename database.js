import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ,
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