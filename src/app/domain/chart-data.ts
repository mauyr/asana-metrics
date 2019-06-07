export interface ChartData {
    options: {
        scaleShowVerticalLines?: boolean,
        responsive: boolean,
        layout?: {
          padding?: {
            left?: number,
            right?: number,
            top?: number,
            bottom?: number
          }
        },
        scales?: {
          xAxes?: [{
              stacked?: boolean
          }],
          yAxes: [{
              stacked?: boolean
          }]
        }
    },
    labels: string[],
    type: string,
    legend: boolean,
    data: {
      data: number[], 
      label: string
    }[]
}