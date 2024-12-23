import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const valuesPath = "./scripts/merkleTree/target/values.csv";
const [encoding, ...leafs] = fs
    .readFileSync(valuesPath, "utf-8")
    .trim()
    .split("\n");

const tree = StandardMerkleTree.of(
    leafs.map((leaf) => leaf.split(",")),
    encoding.split(",")
);

console.log(`Merkle Root: ${tree.root}`);

fs.writeFileSync("./scripts/merkleTree/target/treeFromCSV.json", JSON.stringify(tree.dump()));