const Rail = require('national-rail-darwin');
const axios = require('axios');
const { DateTime } = require('luxon');

const rail = new Rail(process.env.NATIONAL_RAIL_API);

async function getArrivals(req, res) {
    const { origin, destination } = req.params;
    try {
        rail.getArrivalsBoardWithDetails(
            origin.toUpperCase(),
            { destination: destination.toUpperCase() },
            (e, result) => {
                res.status(200).json(result);
            }
        );
    } catch (error) {
        Error(error);
    }
}

async function getTimeTable(req, res) {
    const origin = req.params.origin.toUpperCase();
    const destination = req.params.destination.toUpperCase();

    const date = req.query.date || DateTime.local().toFormat('yyyy-LL-dd');
    const hourFrom = parseInt(req.query.from) || 16;
    const hourTo = parseInt(req.query.to) || 22;

    const trainDest =
        destination === 'RDG'
            ? ['Reading', 'London Paddington']
            : ['Swansea', 'Carmarthen'];

    const api = `http://fcc.transportapi.com/v3/uk/train/station/${origin}/${date}`;
    try {
        const axiosList = [];
        const exist = [];
        const all = [];

        for (let i = 0; i < hourTo - hourFrom; i++) {
            axiosList.push(
                axios.get(`${api}/${hourFrom + i}:00/timetable.json`)
            );
            axiosList.push(
                axios.get(`${api}/${hourFrom + i}:30/timetable.json`)
            );
        }

        (await axios.all(axiosList)).map((f) =>
            f.data.departures.all.forEach((t) => {
                if (
                    t.destination_name === trainDest[0] ||
                    t.destination_name === trainDest[1]
                ) {
                    if (!exist.includes(t.train_uid)) {
                        exist.push(t.train_uid);
                        all.push(t);
                    }
                }
            })
        );

        const timetables = await Promise.all(
            all.map(async (t) => {
                const single = {};
                const tt = await axios.get(t.service_timetable.id);
                for (let i = 0; i < tt.data.stops.length; i++) {
                    const stop = tt.data.stops[i];
                    if (stop.station_code === origin) {
                        single.d = stop.aimed_departure_time;
                    }

                    if (stop.station_code === destination) {
                        single.a = stop.aimed_arrival_time;
                        break;
                    }
                }
                return Promise.resolve(single);
            })
        );

        res.status(200).json(timetables);
    } catch (error) {
        Error(error);
    }
}

module.exports = {
    getArrivals,
    getTimeTable,
};
