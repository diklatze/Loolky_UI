export interface AggregationsResponse {
    aggregations: { 
        events_over_type: Histogram   
    }
}

export interface Histogram { 
    buckets: bucket[]
}

export interface bucket {
    
    key: any,    
    doc_count: number
 
    countries: Histogram,
    status: StatusHistogram,
    gov: Histogram,
    faculty: Histogram
}

export interface StatusHistogram extends Histogram{
    Pending?: number,
    Approved?: number,
    Declined?: number
}