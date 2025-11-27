import {prisma} from "@/lib/prisma";


export default async function editFile({ params }){
    const {fileId} = await params;
    const file = await prisma.file.findUnique({
        where:{
            id: fileId,
        }
    });
    if(!file){
        return;
    }
    return <>
    Welcome to {file.title}
    </>
}