const { pool } = require('../database');

const uploadFile = (req, res) => {
    const { originalname, mimetype, size } = req.file;
    const { name, ext } = path.parse(originalname);

    pool.query(
        'INSERT INTO files (name, extension, mime_type, size, file_data) VALUES (?, ?, ?, ?, ?)',
        [name, ext, mimetype, size, req.file.buffer],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error uploading file to the database' });
            }

            res.status(201).json({ message: 'File uploaded successfully' });
        }
    );
};

const listFiles = (req, res) => {
    const page = req.query.page || 1;
    const listSize = req.query.list_size || 10;
    const offset = (page - 1) * listSize;

    pool.query(
        'SELECT id, name, extension, mime_type, size, timestamp FROM files ORDER BY timestamp DESC LIMIT ? OFFSET ?',
        [listSize, offset],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error fetching files from the database' });
            }

            res.status(200).json({ files: results });
        }
    );
};
const deleteFile = (req, res) => {
    const fileId = req.params.id;

    pool.query('DELETE FROM files WHERE id = ?', [fileId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting file from the database' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(204).end();
    });
};

const getFileDetails = (req, res) => {
    const fileId = req.params.id;

    pool.query('SELECT id, name, extension, mime_type, size, timestamp FROM files WHERE id = ?', [fileId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching file details from the database' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileDetails = result[0];
        res.status(200).json({ file: fileDetails });
    });
};

const downloadFile = (req, res) => {
    const fileId = req.params.id;

    pool.query('SELECT name, extension, mime_type, file_data FROM files WHERE id = ?', [fileId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching file details from the database' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileDetails = result[0];
        res.setHeader('Content-Disposition', `attachment; filename="${fileDetails.name}.${fileDetails.extension}"`);
        res.setHeader('Content-Type', fileDetails.mime_type);
        res.send(fileDetails.file_data);
    });
};

const updateFile = (req, res) => {
    const fileId = req.params.id;
    const { name, extension, mime_type, size } = req.body;

    pool.query(
        'UPDATE files SET name = ?, extension = ?, mime_type = ?, size = ? WHERE id = ?',
        [name, extension, mime_type, size, fileId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error updating file in the database' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'File not found' });
            }

            res.status(200).json({ message: 'File updated successfully' });
        }
    );
};

module.exports = { uploadFile, listFiles, deleteFile, getFileDetails, downloadFile, updateFile }