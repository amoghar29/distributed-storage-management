import prismaSingleton from "../config/db"
const client = prismaSingleton();
export async function selectStorageNode(){
    const nodes = await client.storageNode.findMany({
        where:{ status: "ACTIVE"},
        orderBy: {usedSpace:"asc"}
    });

    if (!nodes.length) throw new Error("No available storage node");

    return nodes[0];
}