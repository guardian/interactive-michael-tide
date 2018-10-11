import * as d3se from 'd3-selection'
import * as d3sc from 'd3-scale'
import * as d3sh from 'd3-shape'
import tides from '../server/tides.json'
import { $, $$ } from './util'

const d3 = Object.assign({}, d3sc, d3se, d3sh)

const names = [ 'Apalachicola',
'Panama City Beach',
'Pensacola', 'Dog River Bridge' ]

tides.sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name)).forEach( (o, index) => {

const svg = d3.select('.tide-container-inner')
    .append('svg')
    .attr('class', 'tide-svg')

const svgEl = $('.tide-svg')

const width = $('.tide-svg').getBoundingClientRect().width - 10
const height = 160  

svg
    .attr('width', width)
    .attr('height', height)
    //.attr('class', 'tide-svg')

const xScale = d3.scaleLinear()
    .domain([ 0, tides[0].data.filter( d => d).length / 10 ])
    .range([ 0, width ])

const yScale = d3.scaleLinear()
    .domain([ -1, 8 ])
    .range([ height, 0 ])

const gs = svg
    .selectAll('.tide-line')
    .data([ 0, 1, 2, 3, 4, 5, 6 ])
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${yScale(d)})`)

const lines = gs
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('class', d => d === 0 ? 'tide-line tide-line--zero' : 'tide-line')

const nums = gs
    .append('text')
    .text( d => (d === 6 && index === 0) ? '6ft above avg' : (d === 0 ? '' : d ))
    .attr('class', 'tide-num')
    .attr('y', -4)

const areaGen = d3.area()
    .x( (d, i) => xScale(i) )
    .y1(d => yScale(d.actual - d.predicted))
    .y0( yScale(0) )
    .defined( d => d.actual > 0 && d.predicted > 0 && d.actual - d.predicted > -3 )

const lineGen = d3.line()
    .x( (d, i) => xScale(i) )
    .y(d => yScale(d.actual - d.predicted))
    .defined( d => d.actual > 0 && d.predicted > 0 && d.actual - d.predicted > -3 )

    svg
        .append('path')
        .attr('class', 'tide-area')
        .attr('d', areaGen(o.data.filter( o => o).filter( ( d, i ) => i % 10 === 0 )))
    
    svg
        .append('path')
        .attr('class', 'tide-top')
        .attr('d', lineGen(o.data.filter( o => o).filter( ( d, i ) => i % 10 === 0 )))

    svg
        .append('circle')
        .attr('cx', 10)
        .attr('cy', yScale(7) - 14)
        .attr('r', 10)
        .attr('class', 'tide-circle')

    svg
        .append('text')
        .attr('x', 10)
        .attr('y', yScale(7) - 10)
        .attr('class', 'tide-index')
        .text(index + 1)

    svg
        .append('text')
        .attr('y', yScale(7) - 10)
        .attr('x', 26)
        .text(o.name)
        .attr('class', 'tide-gauge')


    if(index === 0) {
        svg
            .append('text')
            .text('5 Oct')
            .attr('y', yScale(0) + 15 )
            .attr('class', 'tide-time')
        
        svg
            .append('text')
            .text(o.data.filter(d => d).slice(-1)[0].time)
            .attr('y', yScale(0) + 15)
            .attr('class', 'tide-time tide-time--live')
            .attr('x', width)
    }

    console.log(o.data.filter(d => d).length)

    if(window.resize) { window.resize() }
})
