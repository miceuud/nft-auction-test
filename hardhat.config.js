require('@nomiclabs/hardhat-waffle')

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {},
    rinkeby: {
      // url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      url: `https://eth-rinkeby.alchemyapi.io/v2/MpNnMRTDLXJP1ehoWi3VK-wlsCH8l4ED`,
      accounts: [
        `0x5fa079190e4c3ee7032f92935f03882e27e96986a337b4a928d35447d09b0af4`,
      ],
    },
  },
}
