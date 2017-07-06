var fs = require('fs');

let log = process.argv[2];
if (log && log.endsWith('.log')){
  console.log('');
  console.log('Getting Top Ten Responses')
  console.log('');
  console.log('');
}else {
  console.log('');
  console.log('Add a logfile as an argument');
  console.log('');
  console.log('');
  process.exit();
}

var array = fs.readFileSync(log).toString().split("\n");
const map = new Map();

//filter the data
for(i in array) {
  var response = array[i].split(' ');
  var is200 = parseInt(response[5]) === 200;
  var request_item = response[3];
  var bytes = parseInt(response[6]);
  var isGet = response[2] && response[2].indexOf('GET') > 0;

  if ( isGet && is200){
    const object = map.get(request_item);
    if (!object) {
      map.set(request_item, {byteSum : bytes, count : 1});
    } else {
      let {byteSum, count} = object;
      map.set(request_item, {byteSum: byteSum + bytes, count : ++count});
    }
  }
}

//sort the data
let sortedArr = [...map].sort(function(a,b){
  let aCount = a[1].count;
  let bCount = b[1].count;

  if (aCount < bCount){
    return 1;
  }

  if (aCount > bCount){
    return -1;
  }

  if (aCount === bCount){
    return 0;
  }
});

for (var i = 0; i < 10; i++){
  if (sortedArr[i]){
    console.log(sortedArr[i][0] + ' ' + sortedArr[i][1].byteSum);
  }
}
