import axios from 'axios';



  export const fetchNfts = async (chainId, address, apiKey,token_addresses) => {
    const options = {
  method: 'GET',
  url: '',
  params: {chain: 'eth', format: 'decimal'},
  headers: {accept: 'application/json', 'X-API-Key': apiKey}
};
    options.params.chain = chainId;
    options.params.token_addresses = token_addresses
    options.url = `https://deep-index.moralis.io/api/v2/${address}/nft`
    const NFTS = await  axios.request(options)
    return NFTS;
  }