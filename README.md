
# ERC20 Stacking Smart Contract

This Project is deployed on the Rinkeby testnet

ERC20 Token (Turbo Token) address: 0x9930712D3e191D1a0CcaCb7b9AF6bD2CEc8Fdf4F

Staking contract address: 0xF6153245966B81C42eD6fF49Df5AD9502e7a2ce8


 # Usage
Before running any command, make sure to install dependencies:

 ``` npm install ```

# Compile
Compile the smart contracts with Hardhat:

``` npx hardhat compile ```

 # Test
Run the tests:

``` npx hardhat test ```


 # How to stake
In stacking smart contract function stakeToken() is used to stake the ERC20 token.

this function has following arguments:

uint256 _amount : It is the token amount user want stake.

 # How to Unstake 
The unStakeToken() function is used to complete the process of unstaking

This function calculated price and mint it to the reciepient address.





