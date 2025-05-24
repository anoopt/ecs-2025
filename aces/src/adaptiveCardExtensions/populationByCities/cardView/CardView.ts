import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  BarChartCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IDataPoint,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IPopulationByCitiesAdaptiveCardExtensionProps,
  IPopulationByCitiesAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../PopulationByCitiesAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IPopulationByCitiesAdaptiveCardExtensionProps,
  IPopulationByCitiesAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    // Transform the population data for bar chart
    const populationData = this.state.populationData || [];
    
    // Create series data - ensure we have exactly 3 series for the bar chart
    const series1 = populationData[0] ? {
      name: populationData[0].name,
      data: populationData[0].data as IDataPoint<string>[]
    } : {
      name: 'Berlin',
      data: [
        { x: "2020", y: 3669491 },
        { x: "2021", y: 3677472 },
        { x: "2022", y: 3685034 },
        { x: "2023", y: 3692865 },
        { x: "2024", y: 3700123 }
      ] as IDataPoint<string>[]
    };

    const series2 = populationData[1] ? {
      name: populationData[1].name,
      data: populationData[1].data as IDataPoint<string>[]
    } : {
      name: 'Munich',
      data: [
        { x: "2020", y: 1488202 },
        { x: "2021", y: 1492584 },
        { x: "2022", y: 1496891 },
        { x: "2023", y: 1501234 },
        { x: "2024", y: 1505678 }
      ] as IDataPoint<string>[]
    };

    const series3 = populationData[2] ? {
      name: populationData[2].name,
      data: populationData[2].data as IDataPoint<string>[]
    } : {
      name: 'Hamburg',
      data: [
        { x: "2020", y: 1892122 },
        { x: "2021", y: 1896789 },
        { x: "2022", y: 1901456 },
        { x: "2023", y: 1906123 },
        { x: "2024", y: 1910890 }
      ] as IDataPoint<string>[]
    };

    return BarChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'bar',
        series: [series1, series2, series3]
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
