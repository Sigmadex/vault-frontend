# Vault Smart Contract

## Need to set variables when deploy Vault Smart Contract
constructor parameters <br>
@param _c_i : Concave (0 ~ 10)<br>
@param _c_t : Days (1 ~ )<br>
@param _c_y0 : Starting Point (0 ~ 100%)<br>

## Need to set Owner and SDEX Token Contract Address
function setOwner(address _owner) public<br>
function setTkn(address _TknContract) public {<br>


# Frotend Env Variables

## Need to set env variables in "/public/config/config.json"<br>
NETWORK_ID: 4 // this is rinkeby network ID for default<br>
VAULT_ADDRESS: 0x... //address of Vault smart contract<br>
SDEX_ADDRESS: 0x... //address of SDEX smart contract<br>

## Need to set SDEX Contract's abi in "/public/config/SDEX.json" <br>

Copy SDEX's ABI to this json file

## Need to set Vault Contract's abi in "/public/config/Vault.json" (when only changed the vault smart contract) <br>

Copy Vault's ABI to this json file