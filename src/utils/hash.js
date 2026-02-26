export async function generateSHA256(file) {
    try{
    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest( 'SHA-256', buffer );

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
catch(error){
    console.error("Hash generation failed:" , error);
    return "Hash generation failed";
}
}