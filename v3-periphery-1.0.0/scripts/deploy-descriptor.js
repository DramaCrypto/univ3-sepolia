require('dotenv').config()
const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

async function main() {
  const ethers = hre.ethers
  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const WETH9 = process.env.WETH_SEPOLIA

  const NonfungibleTokenPositionDescriptor = await ethers.getContractFactory(
    'contracts/NonfungibleTokenPositionDescriptor.sol:NonfungibleTokenPositionDescriptor',
    { signer: (await ethers.getSigners())[0] }
  )
  const deployedContract = await NonfungibleTokenPositionDescriptor.deploy(WETH9)
  await deployedContract.waitForDeployment()
  await sleep(30)
  const deployedAddress = await deployedContract.target
  console.log('NonfungibleTokenPositionDescriptor deployed to: ', deployedAddress)

  try {
    await hre.run('verify:verify', {
      address: deployedAddress,
      constructorArguments: [WETH9],
    })
    console.log('NonfungibleTokenPositionDescriptor verified: ', deployedAddress)
  } catch (err) {
    console.error(err)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
