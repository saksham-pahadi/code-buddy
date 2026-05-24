"use client"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import WorkspaceRepo from '@/components/WorkspaceRepo';

const page = () => {
    const params = useParams();
    const mode = useSelector((state: RootState) => state.theme.mode);
  return (
    <div className={`${mode === "dark" ? "bg-black text-white" : "bg-white text-black"} h-screen w-full md:w-83/100 px-2 transition-all ease-in-out duration-1000 overflow-y-auto`}>
     
      <WorkspaceRepo repo_id={params.repo_id as string} />
    </div>
  )
}

export default page
