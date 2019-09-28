const fs = require('fs');

function getCoverage(fileStat) {
  const used = fileStat.ranges.reduce((sum, range) => sum += range.end - range.start, 0);
  const total = fileStat.text.length;
  return {
    unused: total - used,
    total: total
  }
}

fs.readFile('./Coverage/Coverage-20190928T082521.json', (err, data) => {
  const jsonData = JSON.parse(data);

  const allFileStat = jsonData.map(fileStat => {
    const statInRange = getCoverage(fileStat);
    return {
      url: fileStat.url,
      total: statInRange.total,
      unused: statInRange.unused
    }
  }).sort((a, b) => b.total - a.total);

  console.log("Coverage for separate files:")
  console.table(allFileStat);

  const isJsFile = /\.js/;
  const isCssFile = /\.css/;

  const typeStat = allFileStat.reduce((res, stat) => {
    if (isJsFile.test(stat.url)) {
      res.js += stat.unused;      
    } else if (isCssFile.test(stat.url)) {
      res.css += stat.unused;
    } else {
      res.other =+ stat.unused;
    }
    return res;
  }, {js: 0, css: 0, other: 0});

  Object.keys(typeStat).forEach(key => {
    typeStat[key] = Math.floor(typeStat[key] / 1024);
  });

  console.log("Usage by file type:")
  console.table(typeStat);
});