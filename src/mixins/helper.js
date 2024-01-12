export const helperMixin = {
    data: () => ({
    }),
    methods: {
        compareArrays(a,b){
            return JSON.stringify(a) === JSON.stringify(b)
        }
  }
  
}