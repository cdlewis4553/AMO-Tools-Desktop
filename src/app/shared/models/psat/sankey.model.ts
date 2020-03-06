export interface PsatSankeyNode {
    name: string,
    value: number,
    x: number,
    y: number,
    nodeColor: string,
    source: number,
    target: number[],
    isConnector: boolean,
    id?: string,
}


export interface SankeyNode {
    name: string,
    value: number,
    x: number,
    y: number,
    nodeColor: string,
    source: number,
    target: number[],
    isConnector: boolean,
    id?: string,
}