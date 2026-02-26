import { fileTypeFromBuffer } from "file-type";

export async function identifyFileType(file) {
    const buffer = await file.arrayBuffer();
    const type = await fileTypeFromBuffer(buffer);

    if(!type){
        return {
            detected: false,
            message: 'No unique binary signature found (text-based or unknown format)'
        };
    }

    return {
        detected: true,
        extension: type.ext,
        mime: type.mime
    };
}