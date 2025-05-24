import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { LandmarksInDusseldorfPropertyPane } from './LandmarksInDusseldorfPropertyPane';
import { AadHttpClientFactory } from '@microsoft/sp-http';
import { IReadonlyTheme, ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';

export interface ILandmarksInDusseldorfAdaptiveCardExtensionProps {
  title: string;
  mainImage: string;
  allowMultipleExpanded: boolean;
}

export interface ILandmarksInDusseldorfAdaptiveCardExtensionState {
  theme: IReadonlyTheme | undefined;
  aadHttpClientFactory: AadHttpClientFactory;
}

const CARD_VIEW_REGISTRY_ID: string = 'LandmarksInDusseldorf_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'LandmarksInDusseldorf_QUICK_VIEW';

export default class LandmarksInDusseldorfAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ILandmarksInDusseldorfAdaptiveCardExtensionProps,
  ILandmarksInDusseldorfAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: LandmarksInDusseldorfPropertyPane;
  private themeProvider: ThemeProvider;
  private theme: IReadonlyTheme | undefined;

  public onInit(): Promise<void> {
    this.themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this.theme = this.themeProvider.tryGetTheme();
    this.themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    this.state = {
      theme: this.theme,
      aadHttpClientFactory: this.context.aadHttpClientFactory
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  private handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this.setState({
      theme: args.theme
    });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'LandmarksInDusseldorf-property-pane'*/
      './LandmarksInDusseldorfPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.LandmarksInDusseldorfPropertyPane();
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
