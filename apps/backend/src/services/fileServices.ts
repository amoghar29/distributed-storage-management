import prismaSingleton from "../config/db";
const client = prismaSingleton();
export async function saveFileMetadata(fileData: {
  name: string;
  size: number;
  type: string;
  userId: string;
  nodeId: string;
  isPublic?: boolean;
}): Promise<any> {
  return await client.$transaction(async (tx) => {
    // create file record
    const fileurl = `https://${fileData.nodeId}.s3.amazonaws.com/${fileData.name}`;
    const fileMetadata = {
      ...fileData,
      url: fileurl,
    };
    console.log(fileMetadata);
    const file = await tx.file.create({ data: fileMetadata });

    // update user storageUsed
    await tx.user.update({
      where: { id: fileData.userId },
      data: { storageUsed: { increment: fileData.size / (1024 * 1024) } },
    });

    // update StrorageNode usedSpace
    await tx.storageNode.update({
      where: { id: fileData.nodeId },
      data: { usedSpace: { increment: fileData.size / (1024 * 1024) } },
    });
    return file;
  });
}
