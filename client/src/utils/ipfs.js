import ipfsAPI from 'ipfs-api';

const ipfs = new ipfsAPI({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

export function ipfsUpload(buffer) {
  return new Promise(function(resolve, reject) {
    ipfs.add(buffer, (err, ipfsHash) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const hash = ipfsHash[0].hash;
        let res = `https://gateway.ipfs.io/ipfs/${hash}`;

        resolve(res);
      }
    });
  });
}
