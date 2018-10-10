import fs from 'fs'
import fetch from 'node-fetch'
import sync from 'csv-parse/lib/sync'
import moment from 'moment'

const stations = [
    {
        'name' : 'West Fowl R. Bridge',
        'id' : 8738043
    },
    {
        'name' : 'Apalachicola',
        'id' : 8728690
    },
    {
        'name' : 'Pensacola',
        'id' : 8729840
    },
    {
        'name' : 'Panama City Beach',
        'id' : 8729210
    },
    {
        'name' : 'Dog River Bridge',
        'id' : 8735391
    }
]

const get = url => {

    return fetch(url).then( resp => resp.text()).then( text => Promise.resolve(sync(text,  { columns : true }) ))

}

const out = []

const parse = str => moment(str, 'YYYY-MM-DD HH:mm').subtract(5, 'hours').format('D MMM, hh.mma')

stations.slice(1).forEach( s => {

    const urlA = `https://tidesandcurrents.noaa.gov/api/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&station=${s.id}&begin_date=20181005&end_date=20181012&datum=MLLW&units=english&time_zone=GMT&format=csv`
    const urlB = `https://tidesandcurrents.noaa.gov/api/datagetter?product=water_level&application=NOS.COOPS.TAC.WL&station=${s.id}&begin_date=20181005&end_date=20181012&datum=MLLW&units=english&time_zone=GMT&format=csv`

    Promise.all([urlA, urlB].map(get)).then( ([ predicted, actual ]) => {

        const merged = predicted.map( row => {

            const rowB = actual.find(rowB => rowB['Date Time'] === row['Date Time'])
            if(rowB) { 
                const pred = Number(row[' Prediction'])
                const act = Number(rowB[' Water Level'])
                return { time : parse(row['Date Time']), predicted : pred, actual : act }
             }

        } )

        out.push({ id : s.id, name : s.name, data : merged })
        if(out.length === 4) { fs.writeFileSync('./src/server/tides.json', JSON.stringify(out, null, 2)) }
        
    } )

} )