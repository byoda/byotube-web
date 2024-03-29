import { useAuthStore } from "@/store"
import { toRefs } from "vue"
import { uuid } from "vue-uuid"

export const useApp = () => {

    const { setAccountType } = toRefs(useAuthStore())

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

    return {
        setSessionIdLocalStorage,
        removeSessionIdLocalStorage,
        setAuthAccountType
    }
}