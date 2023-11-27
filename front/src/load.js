/*
 * Project 1 template
 * Data loader example
 *
 * Author: Denis Gracanin
 * Version: 1.0
 */



const dataset = {
  title: "World population",
  data: [
    { year: '1950', population: 2.525 },
    { year: '1960', population: 3.018 },
    { year: '1970', population: 3.682 },
    { year: '1980', population: 4.440 },
    { year: '1990', population: 5.310 },
    { year: '2000', population: 6.127 },
    { year: '2010', population: 6.930 },
  ]
};

const empty = {
    title: "Empty",
    data: [
    ]
}
// const empty = {
//     title: "Average Speed of Cars",
//     data: [
//       { year: '2000', avgSpeed: 55 },
//       { year: '2001', avgSpeed: 57 },
//       { year: '2002', avgSpeed: 53 },
//       { year: '2003', avgSpeed: 58 },
//       { year: '2004', avgSpeed: 52 },
//       { year: '2005', avgSpeed: 60 },
//       { year: '2006', avgSpeed: 56 },
//       { year: '2007', avgSpeed: 59 },
//       { year: '2008', avgSpeed: 54 },
//       { year: '2009', avgSpeed: 61 },
//       { year: '2010', avgSpeed: 65 },
//       { year: '2011', avgSpeed: 63 },
//       { year: '2012', avgSpeed: 68 },
//       { year: '2013', avgSpeed: 62 },
//       { year: '2014', avgSpeed: 67 },
//       { year: '2015', avgSpeed: 64 },
//       { year: '2016', avgSpeed: 70 },
//       { year: '2017', avgSpeed: 66 },
//       { year: '2018', avgSpeed: 69 },
//       { year: '2019', avgSpeed: 57 },
//       { year: '2020', avgSpeed: 72 },
//     ]
//   };
  
  console.log(dataset);
  
  

const grades = {
    title: "Grade Distribution",
    data: [
        {grade: 'A', count: 5},
        {grade: 'A-', count: 10},
        {grade: 'B+', count: 12},
        {grade: 'B', count: 23},
        {grade: 'B-', count: 7},
        {grade: 'C+', count: 9},
        {grade: 'C', count: 16},
        {grade: 'C', count: 3},
        {grade: 'D+', count: 8},
        {grade: 'D', count: 11},
        {grade: 'D-', count: 13},
        {grade: 'F', count: 2},
    ]
}

function load() {
    localStorage.clear();
    localStorage.setItem('pr1.json', JSON.stringify(dataset));
    localStorage.setItem('empty.json', JSON.stringify(empty));
    localStorage.setItem('grades.json', JSON.stringify(grades));
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
}

load();
