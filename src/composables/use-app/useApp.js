import { useAuthService } from "@/services"
import { useAuthStore } from "@/store"
import { toRefs } from "vue"
import { uuid } from "vue-uuid"

export const useApp = () => {

    const { setAccountType } = toRefs(useAuthStore())
    const { setFunded } = useAuthStore()
    const { getStatus } = useAuthService()
    
    const setSessionIdLocalStorage = () => {
        const id = uuid.v4()
        localStorage.setItem('sessionId', id)
    }

    const removeSessionIdLocalStorage = () => {
        localStorage.removeItem('sessionId')
    }

    const setAuthAccountType = () => {
       const account  = localStorage.getItem('account')
       setAccountType.value(account)
    }

    const setAccountStatus = async () => {
        try {
            const { data } = await getStatus()
            if(data?.status === 'healthy'){
                setFunded(false)
            }
        } catch (error) {
            console.error("Error", error)
        }
    }

    return {
        setSessionIdLocalStorage,
        removeSessionIdLocalStorage,
        setAuthAccountType,
        setAccountStatus
    }
}