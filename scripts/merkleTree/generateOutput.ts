import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const values = [
    ["0", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "25000000000000000000"],
    ["1", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "25000000000000000000"],
    ["2", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "25000000000000000000"],
    ["3", "0x90F79bf6EB2c4f870365E785982E1f101E93b906", "25000000000000000000"]
];

const tree = StandardMerkleTree.of(values, ["uint", "address", "uint"]);

console.log(`Merkle Root: ${tree.root}`);

fs.writeFileSync("./scripts/merkleTree/target/tree.json", JSON.stringify(tree.dump()));