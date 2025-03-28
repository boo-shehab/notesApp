import http from 'http'
import { URL } from 'url'
import { getNotes, getNote, createNote, EditNote, deleteNote } from './database.js'

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Route: GET /notes
    if (parsedUrl.pathname === '/notes' && req.method === 'GET') {
        try {
            const notes = await getNotes()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(notes))
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Failed to fetch notes' }))
        }
    } 
    // Route: GET /notes/:id
    else if (parsedUrl.pathname.startsWith('/notes/') && req.method === 'GET') {
        const id = parsedUrl.pathname.split('/')[2]
        try {
            const note = await getNote(id)
            if (note) {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(note))
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Note not found' }))
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Failed to fetch note' }))
        }
    } 
    else if (parsedUrl.pathname.startsWith('/notes/') && req.method === 'PUT') {
        const id = parsedUrl.pathname.split('/')[2]
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', async () => {
            try {
                const { title, contents } = JSON.parse(body)
                if (!title || !contents) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Title and contents are required' }))
                    return
                }

                const updatedNote = await EditNote(title, contents, id);
                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(updatedNote))
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to update note: ' + error.message }));
            }
            
        })
    }
    else if (parsedUrl.pathname.startsWith('/notes/') && req.method === 'DELETE') {
        const id = parsedUrl.pathname.split('/')[2];
    
        try {
            await deleteNote(id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Note deleted successfully' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete note: ' + error.message }));
        }
    }
    // Route: POST /notes
    else if (parsedUrl.pathname === '/notes' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', async () => {
            try {
                const { title, contents } = JSON.parse(body)
                if (!title || !contents) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Title and contents are required' }))
                    return
                }
                const newNote = await createNote(title, contents)
                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(newNote))
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Database Insert Error:'+error }))
            }
        })
    } 
    // Route not found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Route not found' }))
    }
})

const PORT = process.env.MYSQLPORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});