import yargs from "yargs/yargs";
import dotenv from "dotenv";
import artifacts from "../../artifacts-tron/contracts/TRC20Token.sol/TRC20Token.json";
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
        })
        .option("contractAddress", {
            type: "string",
            describe: "contract address",
            default: "TRp3YNLZa2Ra3McN67ZShrRMn7eiFt8y1d",
        });
    return options.argv;
}

async function main() {
    let options: any = getOptions();
    const dryRun = options.dryRun;
    const network = options.network;
    const contractAddress = options.contractAddress;
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
            const contract = await tronWeb.contract(contractABI, contractAddress);
            // const result = await contract.balanceOf("TQzQaUjtD8JVhj7nRDx4jDz9iGgZxPQ3gb").call();
            // console.log(result.toString());

            let txHash = await contract.transfer("THSK6wkJ3L3LnyJMh28DU8mNn66zg7PGU9", 100).send();
            console.log(txHash);

        } catch (e) {
            console.log(`Interaction Failed, Error=${JSON.stringify(e)}`);
        }
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });