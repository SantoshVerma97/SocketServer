const moment = require('moment/moment');
const client = require('../connection/database');

module.exports.UpdateLocation = async (req, res) => {
    try {
        const { latitude, longitude, timestamp, vehicle_number, driver_license, shift_time, shift_type, trip_ended, trip_id, speed, heading } = req;

        console.log("Hello world>>>>>>>>",req);

        const date = moment().format('YYYY-MM-DD hh:mm:ss')
        const getQuery = `SELECT * FROM public.vehicle_tracker WHERE vehicle_number = '${vehicle_number}';`
        client.query(getQuery, (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                if (res.rowCount > 0) {
                    console.log(res.rows[0]);
                    const rowData = res.rows[0];
                    const insertQuery = `INSERT INTO public.vehicle_tracker_archive(
                        driver_license, is_trip_ended, latitude, longitude, shift_time, shift_type, "timestamp", trip_id, vehicle_number, trip_ended,speed,heading)
                        VALUES ('${rowData.driver_license}', ${rowData.trip_ended}, '${rowData.latitude}', '${rowData.longitude}', '${rowData.shift_time}', '${rowData.shift_type}', ${rowData.timestamp}, ${rowData.trip_id}, '${rowData.vehicle_number}', ${rowData.trip_ended}, '${rowData.speed}', '${rowData.heading}');`
                    client.query(insertQuery, (err, res) => {
                        if (err) {
                            console.error('Error executing query', err.stack);
                        } else {
                            console.log('vehicle tracker archieve row inserted successfully');
                            const updateQuery = `UPDATE public.vehicle_tracker
                            SET updated_at='${date}', latitude='${latitude}', longitude='${longitude}', "timestamp"=EXTRACT(EPOCH FROM '${timestamp}'::timestamp) * 1000, vehicle_number='${vehicle_number}', driver_license='${driver_license}', shift_time='${shift_time}', shift_type='${shift_type}', trip_ended=${trip_ended}, trip_id=${trip_id}
                            , speed = '${speed}', heading = '${heading}'
                            WHERE vehicle_number = '${vehicle_number}';`

                            // console.log(updateQuery);

                            client.query(updateQuery, (err, res) => {
                                if (err) {
                                    console.error('Error executing query', err.stack);
                                } else {
                                    console.log('vehicle tracker row updated successfully');
                                }
                            })
                        }
                    })
                } else {
                    const rawQuery = `INSERT INTO public.vehicle_tracker(
                        created_at,  updated_at,latitude, longitude, "timestamp", vehicle_number, driver_license, shift_time, shift_type, trip_ended, trip_id,speed,heading)
                        VALUES ('${date}', '${date}', '${latitude}', '${longitude}', EXTRACT(EPOCH FROM '${timestamp}'::timestamp) * 1000, '${vehicle_number}', '${driver_license}', '${shift_time}', '${shift_type}', ${trip_ended}, '${trip_id}', '${speed}', '${heading}');`
                    // console.log(rawQuery);
                    client.query(rawQuery, (err, res) => {
                        if (err) {
                            console.error('Error executing query', err.stack);
                        } else {
                            console.log('vehicle tracker row inserted successfully');
                        }
                    })
                }
            }
        });
    } catch (err) {
        throw err;
    }
}