import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PopulationByCitiesPropertyPane } from './PopulationByCitiesPropertyPane';
import { QuickView } from './quickView/QuickView';
import { AadHttpClient, AadHttpClientFactory } from '@microsoft/sp-http';
import { APP_ID, AZURE_FUNCTION_GET_POPULATION_BY_CITIES } from '../../constants/constants';

export interface IPopulationByCitiesAdaptiveCardExtensionProps {
  title: string;
  aadHttpClientFactory: AadHttpClientFactory;
}

export interface IPopulationByCitiesAdaptiveCardExtensionState {
  populationData?: Array<{
    name: string;
    data: Array<{
      x: string;
      y: number;
    }>;
  }>;
}

const CARD_VIEW_REGISTRY_ID: string = 'PopulationByCities_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PopulationByCities_QUICK_VIEW';


export default class PopulationByCitiesAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPopulationByCitiesAdaptiveCardExtensionProps,
  IPopulationByCitiesAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PopulationByCitiesPropertyPane;

  public onInit(): Promise<void> {
    this.state = { 
      populationData: []
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    // Fetch population data
    this.fetchPopulationData().catch(console.error);

    return Promise.resolve();
  }

  private async fetchPopulationData(): Promise<void> {
    try {
      const client = await this.context.aadHttpClientFactory.getClient(APP_ID);
      const response = await client.get(
        AZURE_FUNCTION_GET_POPULATION_BY_CITIES,
        AadHttpClient.configurations.v1
      );
      
      const data = await response.json();
      
      if (data && data.series) {
        this.setState({
          populationData: data.series
        });
      }
    } catch (error) {
      console.error('Error fetching population data:', error);
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PopulationByCities-property-pane'*/
      './PopulationByCitiesPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PopulationByCitiesPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
