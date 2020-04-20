"use strict";

const constructors = [];

function newConstructor(fn, c) {
  constructors.push([fn, c]);
}

// Normal Print Function
newConstructor('print',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: 'print($1)',
    map: [['1','txt']],
    evalParams: ['txt']
});
// Double Quote String
newConstructor('string',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: '"$1"',
    map: [['1','txt']],
    evalParams: []
});
// Single Quote String
newConstructor('string',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: "'$1'",
    map: [['1','txt']],
    evalParams: []
});
// THAIL Print Function
newConstructor('print',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: 'print = $1.',
    map: [['1','txt']],
    evalParams: ['txt']
});
// Double Param Demo
newConstructor('printDBL',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: 'printDBL($1,$2)',
    map: [['1','label'],['2','content']],
    evalParams: ['label','content']
});
newConstructor('printDBL',{
    paren: [{
      open: '(',
      close: ')'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  '],
    c: 'printDBL $1 $2.',
    map: [['1','label'],['2','content']],
    evalParams: ['label','content']
});




const fns = {
  print: (ARGS) => {
    console.log(ARGS.txt);
  },
  string: (ARGS) => {
    return String(ARGS.txt);
  },
  printDBL: (ARGS) => {
    console.log(ARGS.label+": "+ARGS.content);
  }
}

// Back to Actual Engine

function allZero(arr) {
  for(i in arr) {
    if(arr[i] !== 0) {
      return false;
    }
  }
  return true;
}

function splitFromConstructor(txt, c) {
  const p = [], q = [], params = {};

  c.paren.forEach( () => { p.push(0); } );

  c.quoteSets.forEach( () => { q.push(0); } );
/*hi*/
  for(let i = 0, j = 0; i < txt.length; ++i) {
    if(txt[i] === c.c[j]) {
      j++;
    } else {
      if(c.c[j] === "$") {
        j += 2;
        params[c.c[j-1]] = "";
        while(!((txt[i ]=== c.c[j]||(i>txt.length-1))&&allZero(p)&&allZero(q))) {
          params[c.c[j-1]] += txt[i];
          if(allZero(q)) {
            for(let k in c.paren) {
              if(txt[i] === c.paren[k].open) {
                p[k] = p[k] + 1;
              }
              if(txt[i] === c.paren[k].close) {
                p[k] = p[k] - 1;
              }
            }
          }
          for(let k in c.quoteSets) {
            if(txt[i] === c.quoteSets[k]) {
              q[k] = 1 - q[k];
            }
          }
          if(i > txt.length+1) {
            console.log(allZero(q),allZero(p));
            throw Error("Past propper range; check that quotes and parentheses match.")
          }
          i++;
        }
        i--;
      } else {
        throw ("Incorrect constructor")
      }
    }
  } 
  return params;
}

function mapParam(map,param) {
  for(let jkl=0; jkl<map.length; jkl++) {
    if(map[jkl][0]===param) {
      return map[jkl][1];
    }
  }
  return '[UN-NAMED PARAMS]';
}

function readFunction(txt) {
  let curr = {};
  let fn = '';
  let map = [];
  let evalParams = false;
  for(let l in constructors) {
    try {
      curr = splitFromConstructor(txt,constructors[l][1]);
      fn = constructors[l][0];
      evalParams = constructors[l][1].evalParams;
      map = constructors[l][1].map;
    } catch(err) {
      if(err === 'Incorrect constructor') {
        continue;
      } else {
        throw Error(err);
      }
    }
  }
  let ncurr = {};
  for(let l in curr) {
    ncurr[mapParam(map,l)] = curr[l];
  }
  if(evalParams) {
    for(let l of evalParams) {
      ncurr[l] = readFunction(ncurr[l]);
    }
  }
  if(fn !== '') {
    return fns[fn](ncurr);
  } else{
    throw Error('Function does not exist.')
  }
}

// Demo
readFunction('print("Hello World! This is a normal print function.")');
readFunction(`print = 'Hello World! This is the THAIL print function.'.`);
readFunction('printDBL("About","Hello World! This is a double print function.")');

readFunction('printDBL "About" "Hello World! This is a THAIL-style double print function.".');
