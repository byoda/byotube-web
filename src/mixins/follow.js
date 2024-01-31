import VideoService from '@/services/VideoService'

export const followMixin = {
    data: () => ({
        initialState : {
            auth_token: typeof window !== "undefined" ? localStorage.getItem('token') : null,
            domain: typeof window !== "undefined" ? localStorage.getItem('domain') : null,
            isAuthenticated: null,
            user: null
        }
    }),
    methods: {
      follow: function (channelName, origin, serviceId,  createdTimestamp){
        const body = {
            relation: 'follow',
            text: channelName,
            member_id: origin,
            created_timestamp:createdTimestamp
        }
        return VideoService.follow({domain:this.initialState.domain, serviceId: serviceId},{ data: body})
      },
      setFollowed(memberId){
        let alreadyFollowed = JSON.parse(localStorage.getItem('followedAccounts'))
        if(alreadyFollowed?.length){
          if(alreadyFollowed?.includes(memberId)){
            alreadyFollowed = alreadyFollowed.filter(member => member !== memberId)
          }else{
            alreadyFollowed.push(memberId)
          }
          localStorage.setItem('followedAccounts', JSON.stringify(alreadyFollowed))
        }else{
          const followedAccounts = [memberId]
          localStorage.setItem('followedAccounts',JSON.stringify(followedAccounts))
        }

        console.log("Member", memberId, alreadyFollowed);
      }
  }
  
}