export interface SankeyNode {
    name: string,
    value: number,
    x: number,
    y: number,
    nodeColor: string,
    source: number,
    targets: number[],
    isConnector: boolean,
    id?: string,
    width: number
}

export interface SankeyData {
    energyInput: number,
    losses: Array<{
        groupIndex: number,
        label: string,
        value: number
    }>,
    additions: Array<{ label: string, value: number }>
    outputEnergy: Array<{ label: string, value: number }>
}

export interface SankeyColors {
    gradientStartColor: string;
    gradientEndColor: string;
    nodeStartColor: string;
    nodeArrowColor: string;
}