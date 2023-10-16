const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const credentials = require('./credentials.json');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;
app.use(bodyParser.json());

const sheets = google.sheets('v4');
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);
const sheetId = '1hmRAol5kjLDuciEu9B2hSz3ovfGnOJePUz6KmQGagkQ'

//Leer

app.get('/api/data', async (req, res) => {
    try {
        await client.authorize();
        const response = await sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId: sheetId,
            range: 'crudBitwan!A2:D'
        });
        res.json(response.data.values);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

//Crear

app.post('/api/send', async (req, res) => {
    const newData = req.body;

    try {
        console.log("Nuevos Datos", newData);
        await client.authorize();
        const response = await sheets.spreadsheets.values.append({
            auth: client,
            spreadsheetId: sheetId,
            range: 'crudBitwan!A2:D',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [Object.values(newData)]
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding data');
    }
});

//Actualizar

app.put('/api/update/:id', async (req, res) => {
    const rowId = parseInt(req.params.id) + 2;
    if (isNaN(rowId)) {
        return res.status(400).send('ID debe ser un número entero');
    }

    const updatedData = req.body;

    try {
        await client.authorize();
        const response = await sheets.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetId,
            range: `crudBitwan!A${rowId}:D${rowId}`,
            valueInputOption: 'RAW',
            resource: {
                values: [Object.values(updatedData)]
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando datos');
    }
});

//Eliminar

app.delete('/api/delete/:id', async (req, res) => {
    const rowId = parseInt(req.params.id) + 2;
    if (isNaN(rowId)) {
        return res.status(400).send('ID debe ser un número entero');
    }

    try {
        await client.authorize();
        const response = await sheets.spreadsheets.batchUpdate({
            auth: client,
            spreadsheetId: sheetId,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: 'ROWS',
                                startIndex: rowId - 1,
                                endIndex: rowId
                            }
                        }
                    }
                ]
            }
        });
        res.json({ message: `Fila ${rowId} eliminada correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error eliminando la fila');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});