import { uuid } from "vue-uuid"

export const useApp = () => {
    const setSessionIdLocalStorage = () => {
        const id = uuid.v4()
        localStorage.setItem('sessionId', id)
    }

    const removeSessionIdLocalStorage = () => {
        localStorage.removeItem('sessionId')
    }

    return {
        setSessionIdLocalStorage,
        removeSessionIdLocalStorage
    }
}