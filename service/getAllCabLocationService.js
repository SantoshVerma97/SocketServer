const client = require('../connection/database');

module.exports.GetAllCabLocationService = async () => {
    try {
        const rawQuery = `SELECT * FROM public.vehicle_tracker`;
        
        // Return a promise from the query
        const result = await new Promise((resolve, reject) => {
            client.query(rawQuery, (err, rows) => {
                if (err) {
                    console.error('Error executing query', err.stack);
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(rows.rows); // Resolve with the data
                }
            });
        });

        return result;
    } catch (err) {
        console.error('Error in GetAllCabLocationService:', err);
        return err;
    }
};
