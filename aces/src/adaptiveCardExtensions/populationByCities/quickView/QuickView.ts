import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PopulationByCitiesAdaptiveCardExtensionStrings';
import {
  IPopulationByCitiesAdaptiveCardExtensionProps,
  IPopulationByCitiesAdaptiveCardExtensionState
} from '../PopulationByCitiesAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IPopulationByCitiesAdaptiveCardExtensionProps,
  IPopulationByCitiesAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
