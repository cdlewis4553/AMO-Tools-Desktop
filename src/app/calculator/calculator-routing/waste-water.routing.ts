import { Routes } from "@angular/router";
import { StatePointAnalysisComponent } from "../waste-water/state-point-analysis/state-point-analysis.component";
import { WasteWaterListComponent } from "../waste-water/waste-water-list/waste-water-list.component";

export const fanRoutes: Routes = [
    {
        path: '',
        component: WasteWaterListComponent
    },
    {
        path: 'state-point-analysis',
        component: StatePointAnalysisComponent
    },
]