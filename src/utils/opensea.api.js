import axios from 'axios';


export const fetchNftMeta = async (tokenId, address) => {
    const options = {
  method: 'GET',
  url: '',
  params: {chain: 'eth', format: 'decimal'},
  // headers: {accept: 'application/json', 'X-API-Key': apiKey}
};
    options.url = `https://api.opensea.io/api/v1/asset/${address}/${tokenId}/?include_orders=false`
    const NFT = await  axios.request(options)
    return NFT;
  }