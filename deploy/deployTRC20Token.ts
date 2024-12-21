import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
const TronWeb = require('tronweb');
// import axios from 'axios';
// import FormData from 'form-data';
// import { readFileSync } from 'fs';

const contractName = "TRC20Token";

const deployContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { network, deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    // const chainId = network.config.chainId;

    const waitBlockConfirmations = 1;

    let fullHost: string;
    if (network.name == "shasta") {
        fullHost = "https://api.shasta.trongrid.io";
    } else {
        fullHost = "https://api.trongrid.io";
    }

    const tronWeb = new TronWeb({
        fullHost,
        headers: { "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY },
        privateKey: process.env.TRON_PRIVATE_KEY
    });

    log("\n------------------------------------------------------------------------\n");

    const TRC20TokenArgs = [
        "TRC20 Test Token",
        "TT",
        1000000000
    ];

    const TRC20TokenContract = await deploy(contractName, {
        from: deployer,
        args: TRC20TokenArgs,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    const hexAddress = TRC20TokenContract.address;
    const base58Address = tronWeb.address.fromHex(hexAddress);
    console.log(`Contract deployed at address: ${base58Address}`);

    // const formData = new FormData();

    // // Add required fields
    // formData.append('contractAddress', base58Address);
    // formData.append('contractName', contractName);
    // formData.append('compiler', "tron_v0.8.20+commit.5f1834b");
    // formData.append('license', "3");
    // formData.append('optimizer', '1'); // enabled
    // formData.append('runs', "200");
    // formData.append('constructorParams', JSON.stringify(TRC20TokenArgs));

    // // Read and append source file
    // const sourceFile = "./contracts/TRC20Token.sol";
    // const fileContent = readFileSync(sourceFile);
    // formData.append('files', fileContent, {
    //     filename: sourceFile.split('/').pop(),
    //     contentType: 'application/octet-stream'
    // });

    // const response = await axios.post(
    //     `https://shastapi.tronscan.org/api/solidity/contract/verify`,
    //     formData,
    //     {
    //         headers: {
    //             ...formData.getHeaders(),
    //             'Accept': 'application/json'
    //         }
    //     }
    // );

    // console.log(response.data);

};

export default deployContract;
deployContract.tags = ['all', contractName];