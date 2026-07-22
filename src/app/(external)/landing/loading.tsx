import { Spinner } from "@/components/ui/spinner";

export default function Loading(){
    return(
        <>
        <Spinner className="size-8"/>
        <p>Loading...</p>
        </>
    )
}