import { Request, Response } from "express";
import { generatePresignedUrl } from "../../services/aws/s3Services";
import { saveFileMetadata } from "../../services/fileServices";
import prismaSingleton from "../../config/db";

const client = prismaSingleton();

export async function fileUploadController(
  req: any,
  res: Response
): Promise<void> {
  try {

    const { fileName, fileType, fileSize } = req.query;
    if (!fileName || !fileType) {
      res.status(400).send("Missing required parameters");
      return;
    }
    const fileSizeMB = fileSize / (1024 * 1024);

    const user = await client.user.findUnique({
      where: { id: req.user?.id },
      select: { storageLimit: true, storageUsed: true },
    });
  
    if (!user) throw new Error("User not found");
  
    // Check if user has enough space
    if (user.storageUsed + fileSizeMB > user.storageLimit) {
      throw new Error("Insufficient storage space");
      
    }


    const presignedData = await generatePresignedUrl(
      fileName as string,
      fileType as string
    );

    res.json({
      message: "Presigned URL generated successfully",
      ...presignedData,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    return;
  }
}

export async function fileUploadCompleteController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log(req.body);
    const { name, size, type,  id, nodeId, isPublic } = req.body;
    if (!name || !size || !type || !id || !nodeId) {
      res.status(400).json({ error: "Missing required file metadata" });
      return;
    }

    const file = await saveFileMetadata({
      name,
      size,
      type,      
      userId:id,
      nodeId,
      isPublic,
    });

    res.json({ message: "File metadata saved successfully", file });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save file metadata" });
    return;
  }
}
