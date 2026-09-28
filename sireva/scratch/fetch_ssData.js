import fs from 'fs';
fetch('http://localhost:3000/api/sasaran-strategis')
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('scratch/ssData.json', JSON.stringify(data, null, 2));
    console.log("Written to scratch/ssData.json");
  })
  .catch(err => console.error(err));
