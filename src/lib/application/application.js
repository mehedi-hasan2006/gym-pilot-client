import { sereverMutation } from "@/lib/actions/server"

export const createApplication = (data)=>{
    return sereverMutation('/api/applications', data)
}