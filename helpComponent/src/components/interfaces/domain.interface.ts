export interface ResponseInterface {
    
    code: number
    
}

export interface FindEligibleResponse extends ResponseInterface {
    
    strips: any
    
}