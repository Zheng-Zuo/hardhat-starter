import { ethers, network, deployments, getNamedAccounts, upgrades } from "hardhat";
import { verify } from '../utils';
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from '../../deploy/configs/upgradeableNFTConfig';
import { exit } from "process";
import fs from 'fs';

async function main() {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    console.log("\n----------------------------------------------------\n");

    let proxyAddress: string;
    if (network.name == "arbitrumSepolia") {
        proxyAddress = "0x64aEC2a0c30e1C57b555656F5cfEC0B1e3fA5754";
    } else {
        console.log("Invalid network, exiting...");
        exit(1);
    }

    const upgradeableNFTV2 = await deploy("UpgradeableNFTV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    console.log(`New implementation has been deployed to: ${upgradeableNFTV2.address}`);

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(upgradeableNFTV2.address, []);
    }

    // upgrade
    const proxyAdminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
    const proxyAdmin = await ethers.getContractAt("NFTProxyAdmin", proxyAdminAddress, signer);

    const upgradeTx = await proxyAdmin.upgrade(proxyAddress, upgradeableNFTV2.address);
    await upgradeTx.wait(1);
    console.log("Upgrade completed...\n");
    console.log("----------------------------------------------------\n");

    const upgradeableNFTAddresses = {
        proxy: proxyAddress,
        admin: proxyAdminAddress,
        implementation: await upgrades.erc1967.getImplementationAddress(proxyAddress)
    };

    const path = `./deploy/deploymentAddresses/${network.name}.json`;
    let data: { [key: string]: string; } = {};
    if (fs.existsSync(path)) {
        let rawdata = fs.readFileSync(path);
        data = JSON.parse(rawdata.toString());
    }

    data["upgradeableNFT"] = upgradeableNFTAddresses as any;
    fs.writeFileSync(path, JSON.stringify(data));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });