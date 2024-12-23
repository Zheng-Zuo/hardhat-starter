import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const treePath = "./scripts/merkleTree/target/tree.json";
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync(treePath, "utf8")));

for (const [i, v] of tree.entries()) {
    if (v[1] === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
        const proof = tree.getProof(i);
        console.log("Value: ", v);
        console.log("Proof: ", proof);
    }
}