import yargs from "yargs/yargs";
import dotenv from "dotenv";
import artifacts from "../../artifacts/contracts/TRC20Token.sol/TRC20Token.json";
const TronWeb = require('tronweb');
dotenv.config();

function getOptions() {
    const options = yargs(process.argv)
        .option("dryRun", {
            type: "boolean",
            describe: "only try to simulator run steps, but not execute any on-chain tx",
            default: true
        })
        .option("network", {
            type: "string",
            describe: "network",
            default: "shasta",
        });
    return options.argv;
}

async function main() {
    let options: any = getOptions();
    const dryRun = options.dryRun;
    const network = options.network;
    let fullNode: string;
    let solidityNode: string;
    let eventServer: string;

    if (network == "shasta") {
        fullNode = "https://api.shasta.trongrid.io";
        solidityNode = "https://api.shasta.trongrid.io";
        eventServer = "https://api.shasta.trongrid.io";
    } else {
        fullNode = "https://api.trongrid.io";
        solidityNode = "https://api.trongrid.io";
        eventServer = "https://api.trongrid.io";
    }

    const privateKey = process.env.TRON_PRIVATE_KEY!;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

    const contractABI = artifacts.abi;
    const contractBytecode = artifacts.bytecode;

    if (!dryRun) {
        try {
            const contract = await tronWeb.contract().new({
                abi: contractABI,
                bytecode: contractBytecode,
                feeLimit: 1000000000,
                callValue: 0,
                userFeePercentage: 30,
                originEnergyLimit: 10000000,
                parameters: ['TRC20', 'TRC', 1000000],
            });

            const hexAddress = contract.address;
            const base58Address = tronWeb.address.fromHex(hexAddress);
            console.log(`Contract deployed at address: ${base58Address}`);

        } catch (e) {
            console.log(`Deployment Failed, Error=${JSON.stringify(e)}`);
        }
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });